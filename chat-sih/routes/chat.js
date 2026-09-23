const express = require('express');
const router = express.Router();
const { connectDatabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get all chat rooms
router.get('/rooms', authenticateToken, async (req, res) => {
  try {
    const db = await connectDatabase();
    
    const query = `
      SELECT 
        r.*,
        u.username as created_by_username,
        COUNT(DISTINCT m.id) as message_count,
        COUNT(DISTINCT rm.user_id) as member_count
      FROM chat_rooms r
      LEFT JOIN users u ON r.created_by = u.id
      LEFT JOIN chat_messages m ON r.id = m.room_id AND m.is_deleted = 0
      LEFT JOIN room_members rm ON r.id = rm.room_id
      WHERE r.is_deleted = 0
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `;
    
    const rooms = await db.all(query);
    
    // Parse tags from JSON string
    const roomsWithTags = rooms.map(room => ({
      ...room,
      tags: room.tags ? JSON.parse(room.tags) : []
    }));
    
    res.json({ rooms: roomsWithTags });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: { message: 'Failed to fetch rooms' } });
  }
});

// Create a new chat room
router.post('/rooms', authenticateToken, async (req, res) => {
  try {
    const { name, description, isPrivate, tags } = req.body;
    const userId = req.user.id;
    
    if (!name || !description) {
      return res.status(400).json({ error: { message: 'Name and description are required' } });
    }
    
    const db = await connectDatabase();
    
    // Insert new room
    const result = await db.run(
      `INSERT INTO chat_rooms (name, description, created_by, is_private, tags, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [name, description, userId, isPrivate ? 1 : 0, JSON.stringify(tags || [])]
    );
    
    // Add creator as room member
    await db.run(
      `INSERT INTO room_members (room_id, user_id, joined_at)
       VALUES (?, ?, datetime('now'))`,
      [result.lastID, userId]
    );
    
    // Get the created room with user info
    const room = await db.get(
      `SELECT r.*, u.username as created_by_username
       FROM chat_rooms r
       JOIN users u ON r.created_by = u.id
       WHERE r.id = ?`,
      [result.lastID]
    );
    
    const roomWithTags = {
      ...room,
      tags: room.tags ? JSON.parse(room.tags) : [],
      message_count: 0,
      member_count: 1
    };
    
    res.status(201).json({ room: roomWithTags });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: { message: 'Failed to create room' } });
  }
});

// Join a chat room
router.post('/rooms/:roomId/join', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;
    
    const db = await connectDatabase();
    
    // Check if room exists
    const room = await db.get(
      'SELECT * FROM chat_rooms WHERE id = ? AND is_deleted = 0',
      [roomId]
    );
    
    if (!room) {
      return res.status(404).json({ error: { message: 'Room not found' } });
    }
    
    // Check if user is already a member
    const existingMember = await db.get(
      'SELECT * FROM room_members WHERE room_id = ? AND user_id = ?',
      [roomId, userId]
    );
    
    if (!existingMember) {
      // Add user as room member
      await db.run(
        `INSERT INTO room_members (room_id, user_id, joined_at)
         VALUES (?, ?, datetime('now'))`,
        [roomId, userId]
      );
    }
    
    res.json({ message: 'Successfully joined room' });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ error: { message: 'Failed to join room' } });
  }
});

// Get messages for a chat room
router.get('/rooms/:roomId/messages', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    const db = await connectDatabase();
    
    // Check if user is a member of the room
    const member = await db.get(
      'SELECT * FROM room_members WHERE room_id = ? AND user_id = ?',
      [roomId, req.user.id]
    );
    
    if (!member) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }
    
    const messages = await db.all(
      `SELECT m.*, u.username, u.role
       FROM chat_messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.room_id = ? AND m.is_deleted = 0
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
      [roomId, limit, offset]
    );
    
    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: { message: 'Failed to fetch messages' } });
  }
});

// Send a message to a chat room
router.post('/rooms/:roomId/messages', authenticateToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ error: { message: 'Message content is required' } });
    }
    
    const db = await connectDatabase();
    
    // Check if user is a member of the room
    const member = await db.get(
      'SELECT * FROM room_members WHERE room_id = ? AND user_id = ?',
      [roomId, userId]
    );
    
    if (!member) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }
    
    // Insert message
    const result = await db.run(
      `INSERT INTO chat_messages (room_id, user_id, content, created_at, updated_at)
       VALUES (?, ?, ?, datetime('now'), datetime('now'))`,
      [roomId, userId, content.trim()]
    );
    
    // Get the created message with user info
    const message = await db.get(
      `SELECT m.*, u.username, u.role
       FROM chat_messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.id = ?`,
      [result.lastID]
    );
    
    res.status(201).json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: { message: 'Failed to send message' } });
  }
});

// Delete a message from a chat room
router.delete('/rooms/:roomId/messages/:messageId', authenticateToken, async (req, res) => {
  try {
    const { roomId, messageId } = req.params;
    const userId = req.user.id;
    
    const db = await connectDatabase();
    
    // Check if user is a member of the room
    const member = await db.get(
      'SELECT * FROM room_members WHERE room_id = ? AND user_id = ?',
      [roomId, userId]
    );
    
    if (!member) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }
    
    // Check if message exists and belongs to user
    const message = await db.get(
      'SELECT * FROM chat_messages WHERE id = ? AND room_id = ? AND user_id = ? AND is_deleted = 0',
      [messageId, roomId, userId]
    );
    
    if (!message) {
      return res.status(404).json({ error: { message: 'Message not found or you can only delete your own messages' } });
    }
    
    // Soft delete the message
    await db.run(
      'UPDATE chat_messages SET is_deleted = 1, updated_at = datetime("now") WHERE id = ?',
      [messageId]
    );
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: { message: 'Failed to delete message' } });
  }
});

module.exports = router;