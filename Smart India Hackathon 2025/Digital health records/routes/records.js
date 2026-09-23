const express = require('express');
const router = express.Router();
const recordsController = require('../controllers/recordsController');
const { 
  authenticateToken, 
  requirePatientOrDoctor
} = require('../middleware/auth');
const { 
  validateHealthRecordUpload, 
  validatePatientId, 
  validateRecordId 
} = require('../middleware/validation');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

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

// Get patient records
router.get('/:patient_id', 
  authenticateToken, 
  requirePatientOrDoctor, 
  validatePatientId, 
  recordsController.getPatientRecords
);

// Get specific record
router.get('/record/:record_id', 
  authenticateToken, 
  requirePatientOrDoctor, 
  validateRecordId, 
  recordsController.getRecord
);

// Download record file
router.get('/download/:record_id', 
  authenticateToken, 
  requirePatientOrDoctor, 
  validateRecordId, 
  recordsController.downloadRecord
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
