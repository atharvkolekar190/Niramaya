const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  }
});

class HealthRecord {
  constructor(data) {
    this.record_id = data.record_id;
    this.patient_id = data.patient_id;
    this.doctor_id = data.doctor_id;
    this.title = data.title;
    this.description = data.description;
    this.diagnosis = data.diagnosis;
    this.treatment = data.treatment;
    this.medications = data.medications || [];
    this.vitalSigns = data.vitalSigns || {};
    this.labResults = data.labResults || [];
    this.notes = data.notes;
    this.fileUrl = data.fileUrl;
    this.fileName = data.fileName;
    this.fileType = data.fileType;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Check if Firebase is available
  static isDbAvailable() {
    return !!db;
  }

  // Create a new health record
  static async create(recordData) {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      const recordDoc = {
        record_id: recordData.record_id || uuidv4(),
        patient_id: recordData.patient_id,
        doctor_id: recordData.doctor_id,
        title: recordData.title,
        description: recordData.description,
        diagnosis: recordData.diagnosis,
        treatment: recordData.treatment,
        medications: recordData.medications || [],
        vitalSigns: recordData.vitalSigns || {},
        labResults: recordData.labResults || [],
        notes: recordData.notes,
        fileUrl: recordData.fileUrl,
        fileName: recordData.fileName,
        fileType: recordData.fileType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add to Firebase Firestore
      const docRef = await db.collection('health_records').add(recordDoc);
      recordDoc.id = docRef.id; // Firebase document ID
      
      return new HealthRecord(recordDoc);
    } catch (error) {
      throw new Error(`Error creating health record: ${error.message}`);
    }
  }

  // Create health record with file upload
  static async createWithFile(recordData, file) {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      // Handle file upload
      let fileUrl = null;
      let fileName = null;
      let fileType = null;

      if (file) {
        // For now, we'll store file info without actual file upload to Firebase Storage
        // In a production app, you'd upload to Firebase Storage here
        fileName = file.filename;
        fileType = file.mimetype;
        fileUrl = `/uploads/${file.filename}`;
      }

      const recordDoc = {
        record_id: recordData.record_id || uuidv4(),
        patient_id: recordData.patient_id,
        doctor_id: recordData.doctor_id,
        title: recordData.title,
        description: recordData.description,
        diagnosis: recordData.diagnosis,
        treatment: recordData.treatment,
        medications: recordData.medications || [],
        vitalSigns: recordData.vitalSigns || {},
        labResults: recordData.labResults || [],
        notes: recordData.notes,
        fileUrl: fileUrl,
        fileName: fileName,
        fileType: fileType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add to Firebase Firestore
      const docRef = await db.collection('health_records').add(recordDoc);
      recordDoc.id = docRef.id; // Firebase document ID
      
      return new HealthRecord(recordDoc);
    } catch (error) {
      throw new Error(`Error creating health record with file: ${error.message}`);
    }
  }

  // Get health record by ID
  static async findById(recordId) {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      const snapshot = await db.collection('health_records')
        .where('record_id', '==', recordId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = { id: doc.id, ...doc.data() };
      return new HealthRecord(data);
    } catch (error) {
      throw new Error(`Error finding health record: ${error.message}`);
    }
  }

  // Get health records by patient ID
  static async findByPatientId(patientId) {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      // Query without orderBy to avoid index requirement
      const snapshot = await db.collection('health_records')
        .where('patient_id', '==', patientId)
        .get();

      const records = [];
      snapshot.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        records.push(new HealthRecord(data));
      });

      // Sort in memory instead of using orderBy
      records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return records;
    } catch (error) {
      throw new Error(`Error finding health records by patient: ${error.message}`);
    }
  }

  // Get health records by doctor ID
  static async findByDoctorId(doctorId) {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      // Query without orderBy to avoid index requirement
      const snapshot = await db.collection('health_records')
        .where('doctor_id', '==', doctorId)
        .get();

      const records = [];
      snapshot.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        records.push(new HealthRecord(data));
      });

      // Sort in memory instead of using orderBy
      records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return records;
    } catch (error) {
      throw new Error(`Error finding health records by doctor: ${error.message}`);
    }
  }

  // Update health record
  async update(updateData) {
    try {
      if (!HealthRecord.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      const updatePayload = {
        ...updateData,
        updated_at: new Date().toISOString()
      };

      // Find the document by record_id
      const snapshot = await db.collection('health_records')
        .where('record_id', '==', this.record_id)
        .limit(1)
        .get();

      if (snapshot.empty) {
        throw new Error('Health record not found');
      }

      const doc = snapshot.docs[0];
      await doc.ref.update(updatePayload);

      // Update local instance
      Object.assign(this, updatePayload);
      return this;
    } catch (error) {
      throw new Error(`Error updating health record: ${error.message}`);
    }
  }

  // Delete health record
  async delete() {
    try {
      if (!HealthRecord.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      // Find the document by record_id
      const snapshot = await db.collection('health_records')
        .where('record_id', '==', this.record_id)
        .limit(1)
        .get();

      if (snapshot.empty) {
        throw new Error('Health record not found');
      }

      const doc = snapshot.docs[0];
      await doc.ref.delete();
      return true;
    } catch (error) {
      throw new Error(`Error deleting health record: ${error.message}`);
    }
  }

  // Get all health records
  static async findAll() {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      // Query without orderBy to avoid index requirement
      const snapshot = await db.collection('health_records')
        .get();

      const records = [];
      snapshot.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        records.push(new HealthRecord(data));
      });

      // Sort in memory instead of using orderBy
      records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return records;
    } catch (error) {
      throw new Error(`Error finding all health records: ${error.message}`);
    }
  }

  // Convert to JSON
  toJSON() {
    return {
      record_id: this.record_id,
      patient_id: this.patient_id,
      doctor_id: this.doctor_id,
      title: this.title,
      description: this.description,
      diagnosis: this.diagnosis,
      treatment: this.treatment,
      medications: this.medications,
      vitalSigns: this.vitalSigns,
      labResults: this.labResults,
      notes: this.notes,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      fileType: this.fileType,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = { HealthRecord, upload };