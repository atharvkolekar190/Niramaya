const jwt = require('jsonwebtoken');
const { getDatabase } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: { message: 'Access token required' } 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify user still exists in database
    const db = getDatabase();
    const dbType = process.env.DB_TYPE || 'sqlite';
    
    let user;
    if (dbType === 'sqlite') {
      user = await new Promise((resolve, reject) => {
        db.get('SELECT id, username, email, role FROM users WHERE id = ?', [decoded.userId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    } else {
      const [rows] = await db.execute('SELECT id, username, email, role FROM users WHERE id = ?', [decoded.userId]);
      user = rows[0];
    }

    if (!user) {
      return res.status(401).json({ 
        error: { message: 'User not found' } 
      });
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || 'patient' // Default role if not specified
    };
    
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ 
      error: { message: 'Invalid or expired token' } 
    });
  }
};

// Middleware to check if user is a doctor
const requireDoctor = (req, res, next) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ 
      error: { message: 'Doctor access required' } 
    });
  }
  next();
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: { message: 'Admin access required' } 
    });
  }
  next();
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const db = getDatabase();
    const dbType = process.env.DB_TYPE || 'sqlite';
    
    let user;
    if (dbType === 'sqlite') {
      user = await new Promise((resolve, reject) => {
        db.get('SELECT id, username, email, role FROM users WHERE id = ?', [decoded.userId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    } else {
      const [rows] = await db.execute('SELECT id, username, email, role FROM users WHERE id = ?', [decoded.userId]);
      user = rows[0];
    }

    if (user) {
      req.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || 'patient'
      };
    } else {
      req.user = null;
    }
  } catch (error) {
    req.user = null;
  }
  
  next();
};

module.exports = {
  authenticateToken,
  requireDoctor,
  requireAdmin,
  optionalAuth
};


