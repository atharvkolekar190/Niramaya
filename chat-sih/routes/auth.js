const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email and password are required' }
      });
    }

    const db = getDatabase();
    const dbType = process.env.DB_TYPE || 'sqlite';
    
    let user;
    if (dbType === 'sqlite') {
      user = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    } else {
      const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      user = rows[0];
    }

    if (!user) {
      return res.status(401).json({
        error: { message: 'Invalid credentials' }
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: { message: 'Invalid credentials' }
      });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role || 'patient'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || 'patient'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Register endpoint (for testing purposes)
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { username, email, password, role = 'patient' } = req.body;

    if (!username || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({
        error: { message: 'Username, email, and password are required' }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const db = getDatabase();
    const dbType = process.env.DB_TYPE || 'sqlite';
    
    console.log('Database type:', dbType);
    console.log('Attempting to insert user into database');
    
    let result;
    if (dbType === 'sqlite') {
      result = await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
          [username, email, hashedPassword, role],
          function(err) {
            if (err) {
              console.error('Database error:', err);
              reject(err);
            } else {
              console.log('User inserted successfully with ID:', this.lastID);
              resolve({ insertId: this.lastID });
            }
          }
        );
      });
    } else {
      const [result] = await db.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, role]
      );
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.insertId,
        username,
        email,
        role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'SQLITE_CONSTRAINT' || error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: { message: 'Username or email already exists' }
      });
    }
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    user: req.user
  });
});

// Verify token endpoint
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});

// Refresh token endpoint
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    // Generate a new token with the same user data
    const token = jwt.sign(
      { 
        userId: req.user.id, 
        email: req.user.email,
        role: req.user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Token refreshed successfully',
      token,
      user: req.user
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: { message: 'Internal server error' }
    });
  }
});

module.exports = router;
