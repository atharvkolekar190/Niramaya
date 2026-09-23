const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { db } = require('./config/firebase');
require('dotenv').config();

// Debug environment variables
console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'Yes' : 'No');
console.log('PORT:', process.env.PORT);

// Import routes
const authRoutes = require('./routes/auth');
const recordsRoutes = require('./routes/records');
const patientsRoutes = require('./routes/patients');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:8080', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Healthcare Backend API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/patients', patientsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Healthcare Records Management API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      records: '/api/records',
      health: '/health'
    },
    documentation: 'https://your-api-docs.com'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Handle specific error types
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details || error.message
    });
  }
  
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access'
    });
  }
  
  if (error.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: error.message
    });
  }
  
  // Default error response
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Initialize Firebase and start server
const startServer = async () => {
  try {
    // Test Firebase connection
    if (db) {
      try {
        await db.collection('test').limit(1).get();
        console.log('✅ Firebase connected successfully');
      } catch (error) {
        console.log('⚠️ Firebase connection failed:', error.message);
        console.log('🔄 Running in offline mode');
      }
    } else {
      console.log('⚠️ Firebase not configured, running in offline mode');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Healthcare Backend API running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: ${db ? 'Firebase (Production-ready with file uploads!)' : 'Offline mode'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
