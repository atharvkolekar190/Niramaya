const EHRFolder = require('../models/EHRFolder');
const EHRShare = require('../models/EHRShare');
const Doctor = require('../models/Doctor');
const EHRNotification = require('../models/EHRNotification');
const { recordAuditEvent } = require('../models/EHRAudit');

const { HealthRecord } = require('../models/HealthRecord');

const listFolders = async (req, res) => {
  try {
    await EHRFolder.createAccountHolder(req.user.patient_id, {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      age: req.user.age,
      gender: req.user.gender,
      address: req.user.address
    });
    const folders = await EHRFolder.findByOwner(req.user.patient_id);
    res.json({ success: true, data: { folders: folders.map(folder => folder.toJSON()) } });
  } catch (error) {
    console.error('List EHR folders error:', error.message);
    res.status(500).json({ success: false, message: 'Unable to load EHR folders', error: error.message });
  }
};

const listFolderRecords = async (req, res) => {
  try {
    const folder = await EHRFolder.findById(req.params.folder_id);
    if (!folder || folder.owner_patient_id !== req.user.patient_id) {
      return res.status(404).json({ success: false, message: 'EHR folder not found' });
    }
    const records = folder.member_type === 'account_holder'
      ? (await HealthRecord.findByPatientId(folder.owner_patient_id))
        .filter(record => !record.folder_id || record.folder_id === folder.folder_id)
      : await HealthRecord.findByFolderId(folder.folder_id);
    res.json({ success: true, data: { records: records.map(record => record.toJSON()) } });
  } catch (error) {
    console.error('List folder records error:', error);
    res.status(500).json({ success: false, message: 'Unable to load folder records' });
  }
};

const createFolder = async (req, res) => {
  try {
    const { name, member_type, profile } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'A family member name is required' });
    }
    const folder = await EHRFolder.create({
      owner_patient_id: req.user.patient_id,
      name: name.trim(),
      member_type,
      profile
    });
    res.status(201).json({ success: true, data: { folder: folder.toJSON() } });
  } catch (error) {
    console.error('Create EHR folder error:', error.message);
    res.status(500).json({ success: false, message: 'Unable to create EHR folder', error: error.message });
  }
};

const deleteFolder = async (req, res) => {
  try {
    const folder = await EHRFolder.findById(req.params.folder_id);
    if (!folder || folder.owner_patient_id !== req.user.patient_id) {
      return res.status(404).json({ success: false, message: 'EHR folder not found' });
    }
    if (folder.member_type === 'account_holder') {
      return res.status(409).json({ success: false, message: 'The account-holder folder cannot be deleted' });
    }

    const records = await HealthRecord.findByFolderId(folder.folder_id);
    const shares = await EHRShare.findActiveForOwner(folder.folder_id, req.user.patient_id);
    const activeShareCount = shares.filter(share => share.status === 'active').length;
    const confirmDataLoss = req.body?.confirm_data_loss === true;
    if (records.length > 0 && !confirmDataLoss) {
      return res.status(409).json({
        success: false,
        requires_confirmation: true,
        record_count: records.length,
        active_share_count: activeShareCount,
        message: 'This folder contains documents. Confirm archival to continue.'
      });
    }

    const revokedShareCount = await EHRShare.revokeForFolder(folder.folder_id, req.user.patient_id);
    if (!(await folder.archive(req.user.patient_id))) {
      return res.status(409).json({ success: false, message: 'Folder could not be archived' });
    }
    await recordAuditEvent({
      event_type: 'folder_archived',
      actor_id: req.user.patient_id,
      actor_role: 'patient',
      folder_id: folder.folder_id
    });
    res.json({
      success: true,
      message: records.length > 0 ? 'Folder archived and sharing access revoked' : 'Folder deleted',
      data: { archived: true, record_count: records.length, revoked_share_count: revokedShareCount }
    });
  } catch (error) {
    console.error('Delete EHR folder error:', error.message);
    res.status(500).json({ success: false, message: 'Unable to delete EHR folder' });
  }
};

const listDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json({ success: true, data: { doctors: doctors.map(doctor => ({
      id: doctor.doctor_id, name: doctor.name, email: doctor.email,
      specialization: doctor.specialization, hospital: doctor.hospital
    })) } });
  } catch (error) {
    console.error('List doctors error:', error);
    res.status(500).json({ success: false, message: 'Unable to load doctors' });
  }
};

const shareFolder = async (req, res) => {
  try {
    const folder = await EHRFolder.findById(req.params.folder_id);
    if (!folder || folder.owner_patient_id !== req.user.patient_id) {
      return res.status(404).json({ success: false, message: 'EHR folder not found' });
    }
    const { doctor_id } = req.body;
    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    const { share, accessKey } = await EHRShare.create({
      folderId: folder.folder_id,
      ownerPatientId: req.user.patient_id,
      doctorId: doctor.doctor_id,
      accessCode: folder.sharing_code
    });
    await EHRNotification.create({
      doctor_id: doctor.doctor_id,
      share_id: share.share_id,
      folder_id: folder.folder_id,
      patient_name: req.user.name,
      folder_name: folder.name,
      shared_at: share.created_at,
      expires_at: share.expires_at
    });
    await recordAuditEvent({ event_type: 'share_created', actor_id: req.user.patient_id, actor_role: 'patient', folder_id: folder.folder_id, share_id: share.share_id });
    res.status(201).json({
      success: true,
      data: {
        access_key: accessKey,
        sharing_code: folder.sharing_code,
        expires_at: share.expires_at,
        share: share.toJSON()
      }
    });
  } catch (error) {
    console.error('Share EHR folder error:', error);
    res.status(500).json({ success: false, message: 'Unable to share EHR folder' });
  }
};

const listNotifications = async (req, res) => {
  try {
    const notifications = await EHRNotification.findForDoctor(req.user.doctor_id);
    const enriched = await Promise.all(notifications.map(async notification => {
      const share = await EHRShare.findById(notification.share_id, req.user.doctor_id);
      return {
        ...notification.toJSON(),
        access_status: share ? share.status : 'revoked',
        expires_at: share ? share.expires_at : notification.expires_at
      };
    }));
    res.json({ success: true, data: { notifications: enriched } });
  } catch (error) {
    console.error('List EHR notifications error:', error.message);
    res.status(500).json({ success: false, message: 'Unable to load EHR notifications' });
  }
};

const openNotification = async (req, res) => {
  try {
    const notification = (await EHRNotification.findForDoctor(req.user.doctor_id))
      .find(item => item.notification_id === req.params.notification_id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    const share = await EHRShare.findById(notification.share_id, req.user.doctor_id);
    if (!share || share.status !== 'active') {
      return res.status(403).json({ success: false, message: 'This EHR access is expired or revoked' });
    }
    const folder = await EHRFolder.findById(share.folder_id);
    if (!folder) return res.status(404).json({ success: false, message: 'EHR folder not found' });
    await notification.markRead();
    const records = folder.member_type === 'account_holder'
      ? (await HealthRecord.findByPatientId(folder.owner_patient_id))
        .filter(record => !record.folder_id || record.folder_id === folder.folder_id)
      : await HealthRecord.findByFolderId(folder.folder_id);
    res.json({
      success: true,
      data: { folder: folder.toJSON(), records: records.map(record => record.toJSON()), expires_at: share.expires_at }
    });
  } catch (error) {
    console.error('Open EHR notification error:', error.message);
    res.status(500).json({ success: false, message: 'Unable to open shared EHR' });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const notification = (await EHRNotification.findForDoctor(req.user.doctor_id))
      .find(item => item.notification_id === req.params.notification_id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    await notification.markRead();
    res.json({ success: true });
  } catch (error) {
    console.error('Mark EHR notification read error:', error.message);
    res.status(500).json({ success: false, message: 'Unable to update notification' });
  }
};

const dismissNotification = async (req, res) => {
  try {
    const notification = (await EHRNotification.findForDoctor(req.user.doctor_id))
      .find(item => item.notification_id === req.params.notification_id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    await notification.dismiss();
    res.json({ success: true });
  } catch (error) {
    console.error('Dismiss EHR notification error:', error.message);
    res.status(500).json({ success: false, message: 'Unable to dismiss notification' });
  }
};

const listShares = async (req, res) => {
  try {
    const folder = await EHRFolder.findById(req.params.folder_id);
    if (!folder || folder.owner_patient_id !== req.user.patient_id) {
      return res.status(404).json({ success: false, message: 'EHR folder not found' });
    }
    const shares = await EHRShare.findActiveForOwner(folder.folder_id, req.user.patient_id);
    res.json({ success: true, data: { shares: shares.map(share => share.toJSON()) } });
  } catch (error) {
    console.error('List EHR shares error:', error);
    res.status(500).json({ success: false, message: 'Unable to load sharing status' });
  }
};

const revokeShare = async (req, res) => {
  try {
    const folder = await EHRFolder.findById(req.params.folder_id);
    const share = folder && (await EHRShare.findActiveForOwner(folder.folder_id, req.user.patient_id))
      .find(item => item.share_id === req.params.share_id);
    if (!share) return res.status(404).json({ success: false, message: 'Share not found' });
    if (!(await share.revoke(req.user.patient_id))) {
      return res.status(409).json({ success: false, message: 'Share is no longer active' });
    }
    await recordAuditEvent({ event_type: 'share_revoked', actor_id: req.user.patient_id, actor_role: 'patient', folder_id: folder.folder_id, share_id: share.share_id });
    res.json({ success: true, message: 'Access revoked' });
  } catch (error) {
    console.error('Revoke EHR share error:', error);
    res.status(500).json({ success: false, message: 'Unable to revoke access' });
  }
};

const redeemShare = async (req, res) => {
  try {
    if (!req.body.access_key || typeof req.body.access_key !== 'string') {
      return res.status(400).json({ success: false, message: 'Access key is required' });
    }
    const share = await EHRShare.redeem(req.body.access_key, req.user.doctor_id);
    if (!share || share.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Invalid, expired, revoked, or unauthorized access key' });
    }
    const folder = await EHRFolder.findById(share.folder_id);
    if (!folder) return res.status(404).json({ success: false, message: 'EHR folder not found' });
    await recordAuditEvent({ event_type: 'share_redeemed', actor_id: req.user.doctor_id, actor_role: 'doctor', folder_id: folder.folder_id, share_id: share.share_id });
    const records = folder.member_type === 'account_holder'
      ? (await HealthRecord.findByPatientId(folder.owner_patient_id))
        .filter(record => !record.folder_id || record.folder_id === folder.folder_id)
      : await HealthRecord.findByFolderId(folder.folder_id);
    res.json({
      success: true,
      data: { folder: folder.toJSON(), records: records.map(record => record.toJSON()), expires_at: share.expires_at }
    });
  } catch (error) {
    console.error('Redeem EHR share error:', error);
    res.status(500).json({ success: false, message: 'Unable to redeem access key' });
  }
};

module.exports = {
  listFolders, createFolder, deleteFolder, listFolderRecords, listDoctors, shareFolder, listShares,
  revokeShare, redeemShare, listNotifications, openNotification,
  markNotificationRead, dismissNotification
};
