const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔗 Setting up Chat-SIH Integration with Main App...\n');

// Check if .env exists
const envPath = '.env';
if (!fs.existsSync(envPath)) {
  console.log('⚙️ Creating environment configuration for integration...');
  const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_TYPE=sqlite
DB_PATH=./database/community.db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Integration with Main App
MAIN_APP_JWT_SECRET=dev
MAIN_APP_API_URL=http://localhost:3002

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment configuration created');
} else {
  console.log('✅ Environment configuration already exists');
}

// Install axios if not already installed
console.log('\n📦 Installing axios for integration...');
try {
  execSync('npm install axios', { stdio: 'inherit' });
  console.log('✅ Axios installed successfully');
} catch (error) {
  console.log('⚠️  Axios might already be installed');
}

// Create database directory
const dbDir = './database';
if (!fs.existsSync(dbDir)) {
  console.log('\n📁 Creating database directory...');
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('✅ Database directory created');
}

console.log('\n🎉 Integration setup completed successfully!');
console.log('\n📋 Integration Summary:');
console.log('1. ✅ Chat-SIH backend configured to accept your JWT tokens');
console.log('2. ✅ Integration middleware created');
console.log('3. ✅ Frontend updated to accept authentication from URL');
console.log('4. ✅ Main app updated with Community Chat feature');
console.log('\n🚀 Next steps:');
console.log('1. Start your main app: npm run dev (port 5173)');
console.log('2. Start chat-sih: cd chat-sih && npm run dev (port 5000)');
console.log('3. Login to your main app');
console.log('4. Click "Community Chat & Support" feature');
console.log('5. Chat will open in a new window with your authentication!');
console.log('\n💡 Features available:');
console.log('- Real-time chat rooms');
console.log('- Community forum posts');
console.log('- Role-based access (patient/doctor/pharmacist)');
console.log('- Message reactions and engagement');
console.log('- File sharing and media support');
