const crypto = require('crypto');
const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

const SHARE_DURATION_MS = 24 * 60 * 60 * 1000;

class EHRShare {
  constructor(data) {
    Object.assign(this, data);
  }

  static hashKey(key) {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  static async create({ folderId, ownerPatientId, doctorId, accessCode }) {
    if (!db) throw new Error('Firebase database not available');
    const accessKey = accessCode;
    if (!accessKey || accessKey.length !== 10) throw new Error('A valid folder sharing code is required');
    const now = Date.now();
    const share = {
      share_id: uuidv4(),
      folder_id: folderId,
      owner_patient_id: ownerPatientId,
      doctor_id: doctorId,
      access_key_hash: this.hashKey(accessKey),
      status: 'active',
      created_at: new Date(now).toISOString(),
      expires_at: new Date(now + SHARE_DURATION_MS).toISOString(),
      revoked_at: null
    };
    await db.collection('ehr_shares').add(share);
    return { share: new EHRShare(share), accessKey };
  }

  static async findActiveForOwner(folderId, ownerPatientId) {
    if (!db) throw new Error('Firebase database not available');
    const snapshot = await db.collection('ehr_shares')
      .where('folder_id', '==', folderId)
      .where('owner_patient_id', '==', ownerPatientId).get();
    return snapshot.docs.map(doc => new EHRShare({ id: doc.id, ...doc.data() }))
      .map(share => share.withCurrentStatus());
  }

  static async revokeForFolder(folderId, ownerPatientId) {
    if (!db) throw new Error('Firebase database not available');
    const shares = await this.findActiveForOwner(folderId, ownerPatientId);
    const activeShares = shares.filter(share => share.status === 'active');
    const revokedAt = new Date().toISOString();
    await Promise.all(activeShares.map(share =>
      db.collection('ehr_shares').doc(share.id).update({
        status: 'revoked',
        revoked_at: revokedAt
      })
    ));
    return activeShares.length;
  }

  static async redeem(accessKey, doctorId) {
    if (!db) throw new Error('Firebase database not available');
    const snapshot = await db.collection('ehr_shares')
      .where('access_key_hash', '==', this.hashKey(accessKey))
      .where('doctor_id', '==', doctorId).get();
    if (snapshot.empty) return null;
    const shares = snapshot.docs
      .map(doc => new EHRShare({ id: doc.id, ...doc.data() }))
      .map(share => share.withCurrentStatus())
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return shares.find(share => share.status === 'active') || shares[0];
  }

  static async findById(shareId, doctorId) {
    if (!db) throw new Error('Firebase database not available');
    const snapshot = await db.collection('ehr_shares')
      .where('share_id', '==', shareId)
      .where('doctor_id', '==', doctorId).limit(1).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return new EHRShare({ id: doc.id, ...doc.data() }).withCurrentStatus();
  }

  withCurrentStatus() {
    if (this.status === 'active' && new Date(this.expires_at).getTime() <= Date.now()) {
      this.status = 'expired';
    }
    return this;
  }

  async revoke(ownerPatientId) {
    if (!db || this.owner_patient_id !== ownerPatientId) return false;
    const status = this.withCurrentStatus().status;
    if (status !== 'active') return false;
    await db.collection('ehr_shares').doc(this.id).update({
      status: 'revoked',
      revoked_at: new Date().toISOString()
    });
    this.status = 'revoked';
    this.revoked_at = new Date().toISOString();
    return true;
  }

  toJSON(includeSecret = false) {
    const data = { ...this };
    delete data.access_key_hash;
    if (!includeSecret) delete data.id;
    return data;
  }
}

module.exports = EHRShare;
