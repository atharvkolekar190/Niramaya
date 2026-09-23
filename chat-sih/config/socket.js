const jwt = require('jsonwebtoken');
const { getDatabase } = require('./database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Store active users and their socket connections
const activeUsers = new Map();
const userSockets = new Map();

// Initialize Socket.IO with authentication and event handlers
const initializeSocket = (io) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Verify user exists in database
      const db = getDatabase();
      const dbType = process.env.DB_TYPE || 'sqlite';
      
      let user;
      if (dbType === 'sqlite') {
        user = await new Promise((resolve, reject) => {
          db.get('SELECT id, username, email, role, avatar_url FROM users WHERE id = ?', [decoded.userId], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });
      } else {
        const [rows] = await db.execute('SELECT id, username, email, role, avatar_url FROM users WHERE id = ?', [decoded.userId]);
        user = rows[0];
      }

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user.id;
      socket.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || 'patient',
        avatar_url: user.avatar_url
      };

      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`👤 User ${socket.user.username} connected with socket ${socket.id}`);

    // Store user connection
    userSockets.set(socket.userId, socket);
    activeUsers.set(socket.userId, {
      ...socket.user,
      socketId: socket.id,
      isOnline: true,
      lastSeen: new Date()
    });

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);

    // Join general community room
    socket.join('community');

    // Broadcast user online status
    socket.broadcast.emit('user_online', {
      userId: socket.userId,
      username: socket.user.username,
      role: socket.user.role
    });

    // Send current online users to the new user
    socket.emit('online_users', Array.from(activeUsers.values()));

    // Handle joining specific chat rooms
    socket.on('join_room', (roomId) => {
      socket.join(`room_${roomId}`);
      socket.emit('joined_room', { roomId });
      console.log(`👤 User ${socket.user.username} joined room ${roomId}`);
    });

    // Handle leaving chat rooms
    socket.on('leave_room', (roomId) => {
      socket.leave(`room_${roomId}`);
      socket.emit('left_room', { roomId });
      console.log(`👤 User ${socket.user.username} left room ${roomId}`);
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { content, roomId, type = 'text', replyTo = null } = data;

        if (!content || !roomId) {
          socket.emit('error', { message: 'Content and room ID are required' });
          return;
        }

        // Save message to database
        const db = getDatabase();
        const dbType = process.env.DB_TYPE || 'sqlite';
        
        let result;
        if (dbType === 'sqlite') {
          result = await new Promise((resolve, reject) => {
            db.run(
              'INSERT INTO messages (user_id, room_id, content, type, reply_to) VALUES (?, ?, ?, ?, ?)',
              [socket.userId, roomId, content, type, replyTo],
              function(err) {
                if (err) reject(err);
                else resolve({ insertId: this.lastID });
              }
            );
          });
        } else {
          const [result] = await db.execute(
            'INSERT INTO messages (user_id, room_id, content, type, reply_to) VALUES (?, ?, ?, ?, ?)',
            [socket.userId, roomId, content, type, replyTo]
          );
        }

        const message = {
          id: result.insertId,
          userId: socket.userId,
          username: socket.user.username,
          role: socket.user.role,
          avatar_url: socket.user.avatar_url,
          content,
          type,
          replyTo,
          roomId,
          timestamp: new Date(),
          isDoctorVerified: socket.user.role === 'doctor'
        };

        // Broadcast message to room
        io.to(`room_${roomId}`).emit('new_message', message);

        // Also broadcast to community if it's a general message
        if (roomId === 'general') {
          io.to('community').emit('new_message', message);
        }

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { roomId } = data;
      socket.to(`room_${roomId}`).emit('user_typing', {
        userId: socket.userId,
        username: socket.user.username,
        roomId
      });
    });

    socket.on('typing_stop', (data) => {
      const { roomId } = data;
      socket.to(`room_${roomId}`).emit('user_stopped_typing', {
        userId: socket.userId,
        roomId
      });
    });

    // Handle like/unlike messages
    socket.on('toggle_message_like', async (data) => {
      try {
        const { messageId } = data;
        const db = getDatabase();
        const dbType = process.env.DB_TYPE || 'sqlite';

        // Check if user already liked this message
        let existingLike;
        if (dbType === 'sqlite') {
          existingLike = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM message_likes WHERE message_id = ? AND user_id = ?', [messageId, socket.userId], (err, row) => {
              if (err) reject(err);
              else resolve(row);
            });
          });
        } else {
          const [rows] = await db.execute('SELECT id FROM message_likes WHERE message_id = ? AND user_id = ?', [messageId, socket.userId]);
          existingLike = rows[0];
        }

        if (existingLike) {
          // Unlike the message
          if (dbType === 'sqlite') {
            await new Promise((resolve, reject) => {
              db.run('DELETE FROM message_likes WHERE message_id = ? AND user_id = ?', [messageId, socket.userId], (err) => {
                if (err) reject(err);
                else resolve();
              });
            });
          } else {
            await db.execute('DELETE FROM message_likes WHERE message_id = ? AND user_id = ?', [messageId, socket.userId]);
          }

          socket.emit('message_unliked', { messageId, userId: socket.userId });
        } else {
          // Like the message
          if (dbType === 'sqlite') {
            await new Promise((resolve, reject) => {
              db.run('INSERT INTO message_likes (message_id, user_id) VALUES (?, ?)', [messageId, socket.userId], (err) => {
                if (err) reject(err);
                else resolve();
              });
            });
          } else {
            await db.execute('INSERT INTO message_likes (message_id, user_id) VALUES (?, ?)', [messageId, socket.userId]);
          }

          socket.emit('message_liked', { messageId, userId: socket.userId });
        }

        // Broadcast to room
        const roomId = data.roomId;
        if (roomId) {
          socket.to(`room_${roomId}`).emit('message_like_toggled', {
            messageId,
            userId: socket.userId,
            username: socket.user.username,
            liked: !existingLike
          });
        }

      } catch (error) {
        console.error('Error toggling message like:', error);
        socket.emit('error', { message: 'Failed to toggle like' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`👤 User ${socket.user.username} disconnected`);
      
      // Remove from active users
      activeUsers.delete(socket.userId);
      userSockets.delete(socket.userId);

      // Broadcast user offline status
      socket.broadcast.emit('user_offline', {
        userId: socket.userId,
        username: socket.user.username
      });
    });
  });

  return io;
};

module.exports = { initializeSocket, activeUsers, userSockets };


