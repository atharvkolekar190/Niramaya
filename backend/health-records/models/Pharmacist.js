const bcrypt = require('bcryptjs');
const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

class Pharmacist {
  constructor(data) {
    this.pharmacist_id = data.pharmacist_id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.phone = data.phone;
    this.licenseNumber = data.licenseNumber;
    this.pharmacyName = data.pharmacyName;
    this.address = data.address;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Check if Firebase is available
  static isDbAvailable() {
    return !!db;
  }

  // Create a new pharmacist
  static async create(pharmacistData) {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      // Hash password if provided
      if (pharmacistData.password) {
        pharmacistData.password = await bcrypt.hash(pharmacistData.password, 12);
      }

      const pharmacistDoc = {
        pharmacist_id: pharmacistData.pharmacist_id || uuidv4(),
        name: pharmacistData.name,
        email: pharmacistData.email,
        password: pharmacistData.password,
        // Fallback to contact if phone not provided
        phone: pharmacistData.phone ?? pharmacistData.contact,
        licenseNumber: pharmacistData.licenseNumber,
        pharmacyName: pharmacistData.pharmacyName,
        address: pharmacistData.address,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Remove undefined fields to satisfy Firestore
      Object.keys(pharmacistDoc).forEach((key) => {
        if (pharmacistDoc[key] === undefined) {
          delete pharmacistDoc[key];
        }
      });
      
      // Add to Firebase Firestore
      const docRef = await db.collection('pharmacists').add(pharmacistDoc);
      pharmacistDoc.id = docRef.id; // Firebase document ID
      
      return new Pharmacist(pharmacistDoc);
    } catch (error) {
      throw new Error(`Error creating pharmacist: ${error.message}`);
    }
  }

  // Get pharmacist by ID
  static async findById(pharmacistId) {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      const snapshot = await db.collection('pharmacists')
        .where('pharmacist_id', '==', pharmacistId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = { id: doc.id, ...doc.data() };
      return new Pharmacist(data);
    } catch (error) {
      throw new Error(`Error finding pharmacist: ${error.message}`);
    }
  }

  // Get pharmacist by email
  static async findByEmail(email) {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      const snapshot = await db.collection('pharmacists')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = { id: doc.id, ...doc.data() };
      return new Pharmacist(data);
    } catch (error) {
      throw new Error(`Error finding pharmacist by email: ${error.message}`);
    }
  }

  // Update pharmacist
  async update(updateData) {
    try {
      if (!Pharmacist.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      const updatePayload = {
        ...updateData,
        updated_at: new Date().toISOString()
      };

      // Find the document by pharmacist_id
      const snapshot = await db.collection('pharmacists')
        .where('pharmacist_id', '==', this.pharmacist_id)
        .limit(1)
        .get();

      if (snapshot.empty) {
        throw new Error('Pharmacist not found');
      }

      const doc = snapshot.docs[0];
      await doc.ref.update(updatePayload);

      // Update local instance
      Object.assign(this, updatePayload);
      return this;
    } catch (error) {
      throw new Error(`Error updating pharmacist: ${error.message}`);
    }
  }

  // Delete pharmacist
  async delete() {
    try {
      if (!Pharmacist.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      // Find the document by pharmacist_id
      const snapshot = await db.collection('pharmacists')
        .where('pharmacist_id', '==', this.pharmacist_id)
        .limit(1)
        .get();

      if (snapshot.empty) {
        throw new Error('Pharmacist not found');
      }

      const doc = snapshot.docs[0];
      await doc.ref.delete();
      return true;
    } catch (error) {
      throw new Error(`Error deleting pharmacist: ${error.message}`);
    }
  }

  // Verify password
  async verifyPassword(password) {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
  }

  // Get all pharmacists
  static async findAll() {
    try {
      if (!this.isDbAvailable()) {
        throw new Error('Firebase database not available');
      }

      const snapshot = await db.collection('pharmacists')
        .orderBy('created_at', 'desc')
        .get();

      const pharmacists = [];
      snapshot.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        pharmacists.push(new Pharmacist(data));
      });

      return pharmacists;
    } catch (error) {
      throw new Error(`Error finding all pharmacists: ${error.message}`);
    }
  }

  // Convert to JSON (exclude password)
  toJSON() {
    const { password, ...pharmacistData } = this;
    return pharmacistData;
  }
}

module.exports = Pharmacist;