const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

class EHRNotification {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create(data) {
    if (!db) throw new Error('Firebase database not available');
    const notification = {
      notification_id: uuidv4(),
      doctor_id: data.doctor_id,
      share_id: data.share_id,
      folder_id: data.folder_id,
      patient_name: data.patient_name,
      folder_name: data.folder_name,
      shared_at: data.shared_at,
      expires_at: data.expires_at,
      read_at: null,
      dismissed_at: null,
      created_at: new Date().toISOString()
    };
    await db.collection('ehr_notifications').add(notification);
    return new EHRNotification(notification);
  }

  static async findForDoctor(doctorId) {
    if (!db) throw new Error('Firebase database not available');
    const snapshot = await db.collection('ehr_notifications')
      .where('doctor_id', '==', doctorId).get();
    return snapshot.docs
      .map(doc => new EHRNotification({ id: doc.id, ...doc.data() }))
      .filter(notification => !notification.dismissed_at)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async markRead() {
    if (!db) throw new Error('Firebase database not available');
    await db.collection('ehr_notifications').doc(this.id).update({
      read_at: new Date().toISOString()
    });
    this.read_at = new Date().toISOString();
    return this;
  }

  async dismiss() {
    if (!db) throw new Error('Firebase database not available');
    await db.collection('ehr_notifications').doc(this.id).update({
      dismissed_at: new Date().toISOString()
    });
    this.dismissed_at = new Date().toISOString();
    return this;
  }

  toJSON() {
    return { ...this };
  }
}

module.exports = EHRNotification;
