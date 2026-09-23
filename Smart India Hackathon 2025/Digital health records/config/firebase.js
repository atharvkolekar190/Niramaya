const admin = require('firebase-admin');
require('dotenv').config();

// Check if Firebase credentials are available
const hasFirebaseCredentials = process.env.FIREBASE_PROJECT_ID && 
  process.env.FIREBASE_PRIVATE_KEY && 
  process.env.FIREBASE_CLIENT_EMAIL;

let db, auth;

if (hasFirebaseCredentials) {
  // Initialize Firebase Admin SDK with credentials
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
  };

  // Initialize Firebase Admin
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
      });
      db = admin.firestore();
      auth = admin.auth();
      console.log('✅ Firebase Admin initialized successfully');
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error.message);
      console.log('🔄 Running in offline mode without Firebase');
    }
  }
} else {
  console.log('⚠️  Firebase credentials not found, running in offline mode');
  console.log('📝 To enable Firebase, create a .env file with your Firebase credentials');
}

module.exports = { admin, db, auth };
