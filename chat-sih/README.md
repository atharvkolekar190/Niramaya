# Community Chat Application

A full-stack real-time community chat and forum application built with React, Node.js, Express, and Socket.IO. Features include real-time messaging, community posts, user authentication, and role-based access control.

## 🚀 Features

### Core Functionality
- **Real-time Chat** - Live messaging with Socket.IO
- **Chat Rooms** - Create and join multiple chat rooms
- **Community Forum** - Create posts, comments, and discussions
- **User Authentication** - JWT-based authentication with role-based access
- **User Presence** - See who's online in real-time
- **Message Reactions** - Like/unlike messages and posts
- **Tags & Categories** - Organize content with customizable tags
- **Doctor Verification** - Automatic verification for medical professionals
- **Responsive Design** - Mobile-friendly interface
- **File Sharing** - Support for image and file uploads

### User Roles
- **Patients** - Can create posts, comment, and engage with content
- **Doctors** - Can provide verified medical advice with special badges
- **Admins** - Full system access and moderation capabilities

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get current user profile
- `GET /api/auth/verify` - Verify JWT token

### Chat Rooms
- `GET /api/chat/rooms` - Get all chat rooms
- `POST /api/chat/rooms` - Create a new chat room
- `GET /api/chat/rooms/:id/messages` - Get messages for a room
- `POST /api/chat/rooms/:id/join` - Join a room
- `POST /api/chat/rooms/:id/leave` - Leave a room
- `GET /api/chat/rooms/:id/members` - Get room members

### Community Posts
- `POST /api/community/posts` - Create a new post
- `GET /api/community/posts` - List all posts (with pagination, sorting, filtering)
- `GET /api/community/posts/:id` - Get single post with comments

### Comments
- `POST /api/community/posts/:id/comments` - Add comment to post
- `GET /api/community/posts/:id/comments` - List comments for a post

### Engagement
- `POST /api/community/posts/:id/like` - Like/unlike a post
- `GET /api/community/tags` - Get popular tags

### Real-time Events (Socket.IO)
- `send_message` - Send a message to a room
- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator
- `toggle_message_like` - Like/unlike a message

## 🛠️ Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Clone and setup everything automatically
git clone <your-repo-url>
cd chat-sih
node setup.js
npm run dev
```

### Option 2: Manual Setup

#### Prerequisites
- Node.js (v14 or higher)
- Database (SQLite, MySQL, or PostgreSQL)

#### 1. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

#### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration (SQLite - no setup needed)
DB_TYPE=sqlite
DB_PATH=./database/community.db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### 3. Start the Application

**Option A: Using the startup script (Recommended)**
```bash
# Windows
start.bat

# Linux/Mac
./start.sh
```

**Option B: Manual startup**
```bash
# Terminal 1 - Start Backend
npm run server

# Terminal 2 - Start Frontend  
cd client
npm start
```

**Option C: Development mode (if build works)**
```bash
npm run dev
```

#### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## 📊 Database Schema

The application uses the following tables:

### Posts Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `title` - Post title
- `content` - Post content
- `image_url` - Optional image attachment
- `tags` - JSON array of tags
- `created_at` / `updated_at` - Timestamps
- `is_deleted` - Soft delete flag

### Comments Table
- `id` - Primary key
- `post_id` - Foreign key to posts table
- `user_id` - Foreign key to users table
- `content` - Comment content
- `created_at` / `updated_at` - Timestamps
- `is_deleted` - Soft delete flag

### Likes Table
- `id` - Primary key
- `post_id` - Foreign key to posts table
- `user_id` - Foreign key to users table
- `created_at` - Like timestamp
- Unique constraint on (post_id, user_id)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `DB_TYPE` | Database type (sqlite/mysql/postgresql) | sqlite |
| `JWT_SECRET` | JWT signing secret | your-secret-key |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

### Database Configuration

The application automatically detects your database type and applies the appropriate schema. Database schemas are located in the `database/` directory.

## 🚦 Usage Examples

### Creating a Post
```javascript
const response = await fetch('/api/community/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    title: 'Question about medication',
    content: 'I have been taking this medication for a week...',
    tags: ['medication', 'side-effects'],
    image_url: 'https://example.com/image.jpg'
  })
});
```

### Getting Posts with Pagination
```javascript
const response = await fetch('/api/community/posts?page=1&limit=10&sortBy=created_at&order=DESC');
const data = await response.json();
```

### Adding a Comment
```javascript
const response = await fetch('/api/community/posts/123/comments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token'
  },
  body: JSON.stringify({
    content: 'This is a helpful comment'
  })
});
```

### Liking a Post
```javascript
const response = await fetch('/api/community/posts/123/like', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  }
});
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Joi schema validation for all inputs
- **SQL Injection Protection** - Parameterized queries
- **CORS Configuration** - Configurable cross-origin requests
- **Helmet Security** - Security headers middleware

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## 🔄 Integration with Existing System

This community feature is designed to integrate seamlessly with your existing telemedicine system:

1. **Reuses existing users table** - No need to duplicate user data
2. **JWT token compatibility** - Works with your existing authentication
3. **Role-based access** - Supports patient/doctor/admin roles
4. **Database flexibility** - Supports your existing database setup

## 📈 Performance Features

- **Database Indexing** - Optimized queries with proper indexes
- **Pagination** - Efficient data loading
- **Connection Pooling** - Database connection optimization
- **Caching Ready** - Structure supports Redis/memcached integration

## 🛡️ Error Handling

The application includes comprehensive error handling:
- Input validation errors
- Authentication errors
- Database errors
- Rate limiting errors
- Custom error messages with appropriate HTTP status codes

## 📚 Documentation

- API documentation is available at `/api/health` endpoint
- Database schemas are documented in the `database/` directory
- Environment configuration examples in `env.example`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API health endpoint: `GET /api/health`
- Review the error logs in the console
- Ensure your database connection is properly configured
- Verify your JWT secret is set correctly
