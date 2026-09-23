const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Community Chat Application...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js version: ${nodeVersion.trim()}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js first.');
  process.exit(1);
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('cd client && npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Create .env file if it doesn't exist
const envPath = '.env';
if (!fs.existsSync(envPath)) {
  console.log('\n⚙️ Creating environment configuration...');
  const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_TYPE=sqlite
DB_PATH=./database/community.db

# For MySQL (uncomment and configure if needed)
# DB_TYPE=mysql
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=community_db

# For PostgreSQL (uncomment and configure if needed)
# DB_TYPE=postgresql
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_NAME=community_db
# DB_SSL=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment configuration created');
} else {
  console.log('✅ Environment configuration already exists');
}

// Create database directory
const dbDir = './database';
if (!fs.existsSync(dbDir)) {
  console.log('\n📁 Creating database directory...');
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('✅ Database directory created');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Start the development server: npm run dev');
console.log('2. Open your browser to: http://localhost:3000');
console.log('3. Register a new account or login');
console.log('4. Start chatting!');
console.log('\n💡 Tips:');
console.log('- The backend runs on port 5000');
console.log('- The frontend runs on port 3000');
console.log('- Default database is SQLite (no additional setup needed)');
console.log('- For production, configure MySQL or PostgreSQL in .env');
console.log('\n🔧 Available commands:');
console.log('- npm run dev: Start both frontend and backend');
console.log('- npm run server: Start only backend');
console.log('- npm run client: Start only frontend');
console.log('- npm run build: Build for production');




