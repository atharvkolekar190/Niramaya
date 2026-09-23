const jwt = require('jsonwebtoken');
const axios = require('axios');

// Your existing JWT secret (should match your main app)
const MAIN_APP_JWT_SECRET = process.env.MAIN_APP_JWT_SECRET || 'your-main-app-secret';
const MAIN_APP_API_URL = process.env.MAIN_APP_API_URL || 'http://localhost:3002';

// Middleware to verify JWT token from your main app
const authenticateMainAppToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: { message: 'Access token required' } 
    });
  }

  try {
    // Verify token with your main app's JWT secret
    const decoded = jwt.verify(token, MAIN_APP_JWT_SECRET);
    
    // Verify user with your main app's API
    const response = await axios.get(`${MAIN_APP_API_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data && response.data.valid) {
      // Map your user structure to chat-sih expected format
      req.user = {
        id: decoded.userId || decoded.id,
        username: decoded.name || decoded.username,
        email: decoded.email,
        role: decoded.role || 'patient'
      };
      
      next();
    } else {
      return res.status(401).json({ 
        error: { message: 'User verification failed' } 
      });
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ 
      error: { message: 'Invalid or expired token' } 
    });
  }
};

// Optional authentication for public endpoints
const optionalMainAppAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, MAIN_APP_JWT_SECRET);
    
    const response = await axios.get(`${MAIN_APP_API_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data && response.data.valid) {
      req.user = {
        id: decoded.userId || decoded.id,
        username: decoded.name || decoded.username,
        email: decoded.email,
        role: decoded.role || 'patient'
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
  authenticateMainAppToken,
  optionalMainAppAuth
};
