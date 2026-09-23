const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const communityRoutes = require('./routes/community');
const chatRoutes = require('./routes/chat');
const { authenticateMainAppToken, optionalMainAppAuth } = require('./middleware/integrationAuth');
const { connectDatabase } = require('./config/database');
const { initializeSocket } = require('./config/socket');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Security middleware (allow embedding from main app)
app.use(
  helmet({
    frameguard: false, // remove X-Frame-Options header
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", 'https:', "'unsafe-inline'"],
        // Allow external images used in posts
        "img-src": ["'self'", 'data:', 'https:', 'http:'],
        "font-src": ["'self'", 'https:', 'data:'],
        // Allow API and websocket connections
        "connect-src": [
          "'self'",
          'ws:',
          'wss:',
          'http://localhost:5050',
          'http://localhost:3002',
        ],
        // Permit embedding by the main website during development
        "frame-ancestors": ["'self'", 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
      },
    },
  })
);

// Also ensure the legacy header does not block if set by any upstream
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration (allow main app origins)
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
      ];
      if (!origin || allowed.includes(origin)) {
        return callback(null, true);
      }
      // Do not error; simply disable CORS for disallowed origins
      return callback(null, false);
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/community', optionalMainAppAuth, communityRoutes);
app.use('/api/chat', authenticateMainAppToken, chatRoutes);

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Initialize Socket.IO
initializeSocket(io);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Community API'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    server.listen(PORT, () => {
      console.log(`🚀 Community Chat server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`💬 Chat interface: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
