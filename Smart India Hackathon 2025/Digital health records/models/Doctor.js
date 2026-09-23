const bcrypt = require('bcryptjs');
const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

class Doctor {
  constructor(data) {
    this.doctor_id = data.doctor_id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.phone = data.phone;
    this.specialization = data.specialization;
    this.licenseNumber = data.licenseNumber;
    this.hospital = data.hospital;
    this.experience = data.experience;
    this.qualification = data.qualification;
    this.address = data.address;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Check if Firebase is available
  static isDbAvailable() {
    return !!db;
  }

  // Create a new doctor
  static async create(doctorData) {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      // Hash password if provided
      if (doctorData.password) {
        doctorData.password = await bcrypt.hash(doctorData.password, 12);
      }

      const doctorDoc = {
  doctor_id: doctorData.doctor_id || uuidv4(),
  name: doctorData.name,
  email: doctorData.email,
  password: doctorData.password,
  phone: doctorData.phone,
  specialization: doctorData.specialization,
  licenseNumber: doctorData.licenseNumber,
  hospital: doctorData.hospital,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

if (doctorData.experience) {
  doctorDoc.experience = doctorData.experience;
}

if (doctorData.qualification) {
  doctorDoc.qualification = doctorData.qualification;
}

if (doctorData.address) {
  doctorDoc.address = doctorData.address;
}
      
      // Add to Firebase Firestore
      const docRef = await db.collection('doctors').add(doctorDoc);
      doctorDoc.id = docRef.id; // Firebase document ID
      
      return new Doctor(doctorDoc);
    } catch (error) {
      throw new Error(`Error creating doctor: ${error.message}`);
    }
  }

  // Get doctor by ID
  static async findById(doctorId) {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      const snapshot = await db.collection('doctors')
        .where('doctor_id', '==', doctorId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = { id: doc.id, ...doc.data() };
      return new Doctor(data);
    } catch (error) {
      throw new Error(`Error finding doctor: ${error.message}`);
    }
  }

  // Get doctor by email
  static async findByEmail(email) {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      const snapshot = await db.collection('doctors')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = { id: doc.id, ...doc.data() };
      return new Doctor(data);
    } catch (error) {
      throw new Error(`Error finding doctor by email: ${error.message}`);
    }
  }

  // Update doctor
  async update(updateData) {
    try {
      if (!Doctor.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      const updatePayload = {
        ...updateData,
        updated_at: new Date().toISOString()
      };

      // Find the document by doctor_id
      const snapshot = await db.collection('doctors')
        .where('doctor_id', '==', this.doctor_id)
        .limit(1)
        .get();

      if (snapshot.empty) {
        throw new Error('Doctor not found');
      }

      const doc = snapshot.docs[0];
      await doc.ref.update(updatePayload);

      // Update local instance
      Object.assign(this, updatePayload);
      return this;
    } catch (error) {
      throw new Error(`Error updating doctor: ${error.message}`);
    }
  }

  // Delete doctor
  async delete() {
    try {
      if (!Doctor.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      // Find the document by doctor_id
      const snapshot = await db.collection('doctors')
        .where('doctor_id', '==', this.doctor_id)
        .limit(1)
        .get();

      if (snapshot.empty) {
        throw new Error('Doctor not found');
      }

      const doc = snapshot.docs[0];
      await doc.ref.delete();
      return true;
    } catch (error) {
      throw new Error(`Error deleting doctor: ${error.message}`);
    }
  }

  // Verify password
  async verifyPassword(password) {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
  }

  // Get all doctors
  static async findAll() {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      const snapshot = await db.collection('doctors')
        .orderBy('created_at', 'desc')
        .get();

      const doctors = [];
      snapshot.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        doctors.push(new Doctor(data));
      });

      return doctors;
    } catch (error) {
      throw new Error(`Error finding all doctors: ${error.message}`);
    }
  }

  // Convert to JSON (exclude password)
  toJSON() {
    const { password, ...doctorData } = this;
    return doctorData;
  }
}

module.exports = Doctor;