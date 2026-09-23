const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, '..', 'database', 'healthcare.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create patients table
      db.run(`
        CREATE TABLE IF NOT EXISTS patients (
          patient_id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          phone TEXT,
          age INTEGER,
          gender TEXT,
          address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create doctors table
      db.run(`
        CREATE TABLE IF NOT EXISTS doctors (
          doctor_id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          specialization TEXT,
          hospital TEXT,
          contact TEXT,
          license_number TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create pharmacists table
      db.run(`
        CREATE TABLE IF NOT EXISTS pharmacists (
          pharmacist_id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          pharmacy_name TEXT,
          license_number TEXT,
          contact TEXT,
          address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create health records table
      db.run(`
        CREATE TABLE IF NOT EXISTS health_records (
          record_id TEXT PRIMARY KEY,
          patient_id TEXT NOT NULL,
          doctor_id TEXT,
          title TEXT NOT NULL,
          description TEXT,
          diagnosis TEXT,
          treatment TEXT,
          medications TEXT,
          vital_signs TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (patient_id) REFERENCES patients (patient_id),
          FOREIGN KEY (doctor_id) REFERENCES doctors (doctor_id)
        )
      `);

      // Insert demo data
      db.run(`
        INSERT OR IGNORE INTO patients (patient_id, name, email, password, phone, age, gender, address)
        VALUES ('demo-patient-1', 'Ishank Pandey', 'ishank@demo.com', '$2b$10$demo.hash.for.testing', '+91-9876543210', 25, 'male', 'Nabha, Punjab')
      `);

      db.run(`
        INSERT OR IGNORE INTO doctors (doctor_id, name, email, password, specialization, hospital, contact, license_number)
        VALUES ('demo-doctor-1', 'Ishank', 'pandeyishank123@gmail.com', '$2b$10$demo.hash.for.testing', 'General Medicine', 'AIIMS', '7455800398', '12345')
      `);

      console.log('✅ SQLite database initialized successfully');
      resolve();
    });
  });
};

// Database helper functions
const dbHelpers = {
  // Generic insert function
  insert: (table, data) => {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);
      
      const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
      
      db.run(query, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  },

  // Generic find by email function
  findByEmail: (table, email) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ${table} WHERE email = ?`;
      db.get(query, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Generic find by ID function
  findById: (table, id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ${table} WHERE ${table.slice(0, -1)}_id = ?`;
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Generic update function
  update: (table, id, data) => {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(data), id];
      const idColumn = `${table.slice(0, -1)}_id`;
      
      const query = `UPDATE ${table} SET ${columns}, updated_at = CURRENT_TIMESTAMP WHERE ${idColumn} = ?`;
      
      db.run(query, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }
};

module.exports = { db, initializeDatabase, dbHelpers };
