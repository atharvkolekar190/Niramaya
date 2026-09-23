const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql2/promise');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

let db = null;

const getDatabaseType = () => {
  return process.env.DB_TYPE || 'sqlite';
};

const connectDatabase = async () => {
  const dbType = getDatabaseType();
  
  try {
    switch (dbType) {
      case 'sqlite':
        await connectSQLite();
        break;
      case 'mysql':
        await connectMySQL();
        break;
      case 'postgresql':
        await connectPostgreSQL();
        break;
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
    
    console.log(`✅ Connected to ${dbType.toUpperCase()} database`);
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

const connectSQLite = async () => {
  return new Promise((resolve, reject) => {
    const dbPath = process.env.DB_PATH || './database/community.db';
    
    // Ensure database directory exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Initialize schema
      initializeSchema('sqlite')
        .then(() => resolve())
        .catch(reject);
    });
  });
};

const connectMySQL = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'community_db',
    port: process.env.DB_PORT || 3306
  });
  
  db = connection;
  await initializeSchema('mysql');
};

const connectPostgreSQL = async () => {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'community_db',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  });
  
  db = pool;
  await initializeSchema('postgresql');
};

const initializeSchema = async (dbType) => {
  const schemaPath = path.join(__dirname, '..', 'database', `${dbType}_schema.sql`);
  
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found: ${schemaPath}`);
  }
  
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  if (dbType === 'sqlite') {
    return new Promise((resolve, reject) => {
      db.exec(schema, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } else {
    // For MySQL and PostgreSQL, split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await db.execute(statement);
      }
    }
  }
};

const getDatabase = () => {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
};

const closeDatabase = async () => {
  if (db) {
    if (getDatabaseType() === 'sqlite') {
      return new Promise((resolve) => {
        db.close((err) => {
          if (err) console.error('Error closing SQLite database:', err);
          resolve();
        });
      });
    } else {
      await db.end();
    }
    db = null;
  }
};

module.exports = {
  connectDatabase,
  getDatabase,
  closeDatabase,
  getDatabaseType
};


