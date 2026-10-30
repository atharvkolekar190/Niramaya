const express = require('express');
const router = express.Router();
const recordsController = require('../controllers/recordsController');
const { 
  authenticateToken, 
  requirePatientOrDoctor,
  requirePatient,
  requireDoctor
} = require('../middleware/auth');
const ehrController = require('../controllers/ehrController');
const { 
  validateHealthRecordUpload, 
  validatePatientId,
  validateRecordId 
} = require('../middleware/validation');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

// Family EHR folders and doctor shares. These routes are deliberately
// declared before the legacy /:patient_id routes.
router.get('/folders', authenticateToken, requirePatient, ehrController.listFolders);
router.post('/folders', authenticateToken, requirePatient, ehrController.createFolder);
router.delete('/folders/:folder_id', authenticateToken, requirePatient, ehrController.deleteFolder);
router.get('/folders/:folder_id/records', authenticateToken, requirePatient, ehrController.listFolderRecords);
router.get('/doctors', authenticateToken, requirePatient, ehrController.listDoctors);
router.post('/folders/:folder_id/share', authenticateToken, requirePatient, ehrController.shareFolder);
router.get('/folders/:folder_id/shares', authenticateToken, requirePatient, ehrController.listShares);
router.delete('/folders/:folder_id/shares/:share_id', authenticateToken, requirePatient, ehrController.revokeShare);
router.post('/shares/redeem', authenticateToken, requireDoctor, ehrController.redeemShare);
router.get('/notifications', authenticateToken, requireDoctor, ehrController.listNotifications);
router.post('/notifications/:notification_id/open', authenticateToken, requireDoctor, ehrController.openNotification);
router.post('/notifications/:notification_id/read', authenticateToken, requireDoctor, ehrController.markNotificationRead);
router.delete('/notifications/:notification_id', authenticateToken, requireDoctor, ehrController.dismissNotification);

// Upload health record
router.post('/upload', 
  authenticateToken, 
  requirePatientOrDoctor, 
  uploadSingle, 
  handleUploadError, 
  validateHealthRecordUpload, 
  recordsController.uploadRecord
);

// Create health record (without file upload)
router.post('/create', 
  authenticateToken, 
  requirePatientOrDoctor, 
  recordsController.createRecord
);

// Specific record routes must precede the legacy patient-id parameter route.
router.get('/record/:record_id', 
  authenticateToken, 
  requirePatientOrDoctor, 
  validateRecordId, 
  recordsController.getRecord
);

router.get('/download/:record_id', 
  authenticateToken, 
  requirePatientOrDoctor, 
  validateRecordId, 
  recordsController.downloadRecord
);

// Get patient records
router.get('/:patient_id',
  authenticateToken,
  requirePatientOrDoctor,
  validatePatientId,
  recordsController.getPatientRecords
);

// Update record notes
router.put('/:record_id', 
  authenticateToken, 
  requirePatientOrDoctor, 
  validateRecordId, 
  recordsController.updateRecord
);

// Delete record
router.delete('/:record_id', 
  authenticateToken, 
  requirePatientOrDoctor, 
  validateRecordId, 
  recordsController.deleteRecord
);

// Get records by date range
router.get('/:patient_id/date-range', 
  authenticateToken, 
  requirePatientOrDoctor, 
  validatePatientId, 
  recordsController.getRecordsByDateRange
);

module.exports = router;
