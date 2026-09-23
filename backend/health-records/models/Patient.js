const bcrypt = require('bcryptjs');
const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

class Patient {
  constructor(data) {
    this.patient_id = data.patient_id;
    this.name = data.name;
    this.phone = data.phone;
    this.age = data.age;
    this.gender = data.gender;
    this.address = data.address;
    this.email = data.email;
    this.password = data.password;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Check if Firebase is available
  static isDbAvailable() {
    return !!db;
  }

  // Create a new patient
  static async create(patientData) {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      // Hash password if provided
      if (patientData.password) {
        patientData.password = await bcrypt.hash(patientData.password, 12);
      }

      const patientDoc = {
        patient_id: patientData.patient_id || uuidv4(),
        name: patientData.name,
        phone: patientData.phone,
        age: patientData.age,
        gender: patientData.gender,
        address: patientData.address,
        email: patientData.email,
        password: patientData.password,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add to Firebase Firestore
      const docRef = await db.collection('patients').add(patientDoc);
      patientDoc.id = docRef.id; // Firebase document ID
      
      return new Patient(patientDoc);
    } catch (error) {
      throw new Error(`Error creating patient: ${error.message}`);
    }
  }

  // Get patient by ID
  static async findById(patientId) {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      const snapshot = await db.collection('patients')
        .where('patient_id', '==', patientId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = { id: doc.id, ...doc.data() };
      return new Patient(data);
    } catch (error) {
      throw new Error(`Error finding patient: ${error.message}`);
    }
  }

  // Get patient by email
  static async findByEmail(email) {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      const snapshot = await db.collection('patients')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = { id: doc.id, ...doc.data() };
      return new Patient(data);
    } catch (error) {
      throw new Error(`Error finding patient by email: ${error.message}`);
    }
  }

  // Update patient
  async update(updateData) {
    try {
      if (!Patient.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      const updatePayload = {
        ...updateData,
        updated_at: new Date().toISOString()
      };

      // Find the document by patient_id
      const snapshot = await db.collection('patients')
        .where('patient_id', '==', this.patient_id)
        .limit(1)
        .get();

      if (snapshot.empty) {
        throw new Error('Patient not found');
      }

      const doc = snapshot.docs[0];
      await doc.ref.update(updatePayload);

      // Update local instance
      Object.assign(this, updatePayload);
      return this;
    } catch (error) {
      throw new Error(`Error updating patient: ${error.message}`);
    }
  }

  // Delete patient
  async delete() {
    try {
      if (!Patient.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      // Find the document by patient_id
      const snapshot = await db.collection('patients')
        .where('patient_id', '==', this.patient_id)
        .limit(1)
        .get();

      if (snapshot.empty) {
        throw new Error('Patient not found');
      }

      const doc = snapshot.docs[0];
      await doc.ref.delete();
      return true;
    } catch (error) {
      throw new Error(`Error deleting patient: ${error.message}`);
    }
  }

  // Verify password
  async verifyPassword(password) {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
  }

  // Get all patients (for admin/doctor use)
  static async findAll() {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      const snapshot = await db.collection('patients')
        .orderBy('created_at', 'desc')
        .get();

      const patients = [];
      snapshot.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        patients.push(new Patient(data));
      });

      return patients;
    } catch (error) {
      throw new Error(`Error finding all patients: ${error.message}`);
    }
  }

  // Convert to JSON (exclude password)
  toJSON() {
    const { password, ...patientData } = this;
    return patientData;
  }
}

module.exports = Patient;