const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const CODE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const cleanProfile = profile => Object.fromEntries(
  Object.entries(profile || {}).filter(([, value]) => value !== undefined)
);

class EHRFolder {
  constructor(data) {
    this.id = data.id;
    this.folder_id = data.folder_id;
    this.owner_patient_id = data.owner_patient_id;
    this.member_type = data.member_type;
    this.name = data.name;
    this.profile = cleanProfile(data.profile);
    this.sharing_code = data.sharing_code;
    this.sharing_code_hash = data.sharing_code_hash;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.deleted_at = data.deleted_at || null;
    this.deleted_by = data.deleted_by || null;
  }

  static async findById(folderId) {
    if (!db) throw new Error('Firebase database not available');
    const snapshot = await db.collection('ehr_folders')
      .where('folder_id', '==', folderId).limit(1).get();
    if (snapshot.empty) return null;
    const data = snapshot.docs[0].data();
    if (data.deleted_at) return null;
    return new EHRFolder({ id: snapshot.docs[0].id, ...data });
  }

  static async findByIdIncludingDeleted(folderId) {
    if (!db) throw new Error('Firebase database not available');
    const snapshot = await db.collection('ehr_folders')
      .where('folder_id', '==', folderId).limit(1).get();
    if (snapshot.empty) return null;
    return new EHRFolder({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
  }

  static async findByOwner(ownerPatientId) {
    if (!db) throw new Error('Firebase database not available');
    const snapshot = await db.collection('ehr_folders')
      .where('owner_patient_id', '==', ownerPatientId).get();
    const folders = [];
    for (const doc of snapshot.docs) {
      const data = { id: doc.id, ...doc.data() };
      if (data.deleted_at) continue;
      if (!data.sharing_code || !data.sharing_code_hash) {
        data.sharing_code = await this.generateUniqueCode();
        data.sharing_code_hash = this.hashCode(data.sharing_code);
        await doc.ref.update({
          sharing_code: data.sharing_code,
          sharing_code_hash: data.sharing_code_hash,
          updated_at: new Date().toISOString()
        });
      }
      folders.push(new EHRFolder(data));
    }
    folders.sort((a, b) => {
      if (a.member_type === 'account_holder' && b.member_type !== 'account_holder') return -1;
      if (b.member_type === 'account_holder' && a.member_type !== 'account_holder') return 1;
      return new Date(a.created_at) - new Date(b.created_at);
    });
    return folders;
  }

  static async createAccountHolder(ownerPatientId, profile) {
    const existing = await this.findByOwner(ownerPatientId);
    const accountHolder = existing.find(folder => folder.member_type === 'account_holder');
    if (accountHolder) return accountHolder;
    return this.create({
      owner_patient_id: ownerPatientId,
      member_type: 'account_holder',
      name: profile.name,
      profile
    });
  }

  static async generateUniqueCode() {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const bytes = crypto.randomBytes(10);
      let code = '';
      for (const byte of bytes) code += CODE_ALPHABET[byte % CODE_ALPHABET.length];
      const snapshot = await db.collection('ehr_folders')
        .where('sharing_code_hash', '==', this.hashCode(code)).limit(1).get();
      if (snapshot.empty) return code;
    }
    throw new Error('Unable to generate a unique EHR sharing code');
  }

  static hashCode(code) {
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  static async create(folderData) {
    if (!db) throw new Error('Firebase database not available');
    if (!folderData.name || !folderData.owner_patient_id) {
      throw new Error('Folder name and owner are required');
    }
    const existing = await this.findByOwner(folderData.owner_patient_id);
    const duplicate = existing.find(folder =>
      folder.member_type === (folderData.member_type || 'other') &&
      folder.name.trim().toLowerCase() === folderData.name.trim().toLowerCase()
    );
    if (duplicate) return duplicate;
    const sharingCode = await this.generateUniqueCode();
    const folder = {
      folder_id: folderData.folder_id || uuidv4(),
      owner_patient_id: folderData.owner_patient_id,
      member_type: folderData.member_type || 'other',
      name: folderData.name.trim(),
      profile: cleanProfile(folderData.profile),
      sharing_code: sharingCode,
      sharing_code_hash: this.hashCode(sharingCode),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      deleted_by: null
    };
    await db.collection('ehr_folders').add(folder);
    return new EHRFolder(folder);
  }

  async archive(patientId) {
    if (!db || this.owner_patient_id !== patientId || this.member_type === 'account_holder') {
      return false;
    }
    const deletedAt = new Date().toISOString();
    await db.collection('ehr_folders').doc(this.id).update({
      deleted_at: deletedAt,
      deleted_by: patientId,
      updated_at: deletedAt
    });
    this.deleted_at = deletedAt;
    this.deleted_by = patientId;
    return true;
  }

  toJSON() {
    const data = { ...this };
    delete data.id;
    delete data.sharing_code_hash;
    return data;
  }
}

module.exports = EHRFolder;
