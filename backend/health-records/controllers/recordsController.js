const { HealthRecord } = require('../models/HealthRecord');
const { getFileInfo, deleteFile } = require('../middleware/upload');
const path = require('path');

// Upload health record with file
const uploadRecord = async (req, res) => {
  try {
    const userId = req.user.patient_id || req.user.doctor_id || req.user.pharmacist_id;
    const userType = req.userType;
    const { notes, encrypted } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Determine patient_id and doctor_id based on user type
    let patient_id, doctor_id;
    if (userType === 'patient') {
      patient_id = userId;
      doctor_id = null;
    } else if (userType === 'doctor') {
      patient_id = req.body.patient_id;
      doctor_id = userId;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Only patients and doctors can upload health records'
      });
    }

    if (!patient_id) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }

    // Create health record with file
    const recordData = {
      patient_id,
      doctor_id,
      title: req.body.title || req.file.originalname,
      description: req.body.description || '',
      diagnosis: req.body.diagnosis || '',
      treatment: req.body.treatment || '',
      medications: req.body.medications || '',
      vital_signs: req.body.vital_signs || '',
      notes: notes || '',
      encrypted: encrypted || false
    };

    const record = await HealthRecord.createWithFile(recordData, req.file);

    res.status(201).json({
      success: true,
      message: 'Health record uploaded successfully',
      data: {
        record: record.toJSON()
      }
    });
  } catch (error) {
    console.error('Upload record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading health record',
      error: error.message
    });
  }
};

// Create health record (without file upload)
const createRecord = async (req, res) => {
  try {
    const { title, description, diagnosis, treatment, medications, vital_signs } = req.body;
    const userId = req.user.patient_id || req.user.doctor_id || req.user.pharmacist_id;
    const userType = req.userType;
    
    console.log('Create record - userId:', userId);
    console.log('Create record - userType:', userType);
    console.log('Create record - req.user:', req.user);

    // Determine patient_id and doctor_id based on user type
    let patient_id, doctor_id;
    console.log('Checking userType:', userType, 'typeof:', typeof userType);
    
    // For now, assume patient for testing
    patient_id = userId;
    doctor_id = null;
    console.log('Using patient_id:', patient_id);
    console.log('userId from req.user:', req.user.userId);
    console.log('Full req.user object:', JSON.stringify(req.user, null, 2));

    if (!patient_id) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }

    // Create health record
    const recordData = {
      patient_id,
      doctor_id,
      title: title || 'Health Record',
      description: description || '',
      diagnosis: diagnosis || '',
      treatment: treatment || '',
      medications: medications || '',
      vital_signs: vital_signs || ''
    };

    const record = await HealthRecord.create(recordData);

    res.status(201).json({
      success: true,
      message: 'Health record created successfully',
      data: {
        record: record.toJSON()
      }
    });
  } catch (error) {
    console.error('Create record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating health record',
      error: error.message
    });
  }
};

// Get patient records
const getPatientRecords = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Get records for the patient
    const records = await HealthRecord.findByPatientId(patient_id, parseInt(limit));

    // Apply pagination
    const paginatedRecords = records.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Patient records retrieved successfully',
      data: {
        records: paginatedRecords.map(record => record.toJSON()),
        total: records.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Get patient records error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving patient records',
      error: error.message
    });
  }
};

// Get specific record
const getRecord = async (req, res) => {
  try {
    const { record_id } = req.params;

    const record = await HealthRecord.findById(record_id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Health record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Health record retrieved successfully',
      data: {
        record: record.toJSON()
      }
    });
  } catch (error) {
    console.error('Get record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving health record',
      error: error.message
    });
  }
};

// Download record file
const downloadRecord = async (req, res) => {
  try {
    const { record_id } = req.params;
    console.log('Download request for record ID:', record_id);

    const record = await HealthRecord.findById(record_id);
    if (!record) {
      console.log('Record not found:', record_id);
      return res.status(404).json({
        success: false,
        message: 'Health record not found'
      });
    }

    console.log('Found record:', {
      record_id: record.record_id,
      fileName: record.fileName,
      fileUrl: record.fileUrl
    });

    // Check if we have a Firebase Storage URL
    if (record.fileUrl && record.fileUrl.startsWith('https://firebasestorage.googleapis.com')) {
      console.log('Downloading from Firebase Storage URL:', record.fileUrl);
      
      // For Firebase Storage URLs, redirect to the signed URL or stream the file
      try {
        const response = await fetch(record.fileUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch file from Firebase: ${response.status}`);
        }

        // Set appropriate headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${record.fileName}"`);
        res.setHeader('Content-Type', record.fileType || 'application/octet-stream');

        // Stream the file from Firebase
        const buffer = await response.arrayBuffer();
        res.send(Buffer.from(buffer));
        return;
      } catch (firebaseError) {
        console.error('Firebase download error:', firebaseError);
        return res.status(500).json({
          success: false,
          message: 'Error downloading file from storage',
          error: firebaseError.message
        });
      }
    }

    // Fallback to local file system (for backward compatibility)
    const fs = require('fs');
    // Resolve to absolute path inside project uploads directory
    const uploadsDir = path.resolve(__dirname, '..', 'uploads');
    const safeFileName = (record.fileName || '').toString();
    const derivedName = safeFileName || (record.fileUrl ? path.basename(record.fileUrl) : '');
    const filePath = path.join(uploadsDir, derivedName);
    if (filePath && fs.existsSync(filePath)) {
      console.log('Downloading from local file system:', filePath);
      
      // Set appropriate headers for file download
      res.setHeader('Content-Disposition', `attachment; filename="${derivedName}"`);
      res.setHeader('Content-Type', record.fileType || 'application/octet-stream');

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      return;
    }

    console.log('File not found:', record.fileUrl);
    return res.status(404).json({
      success: false,
      message: 'File not found on server'
    });

  } catch (error) {
    console.error('Download record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading health record',
      error: error.message
    });
  }
};

// Update record notes
const updateRecord = async (req, res) => {
  try {
    const { record_id } = req.params;
    const { notes } = req.body;

    const record = await HealthRecord.findById(record_id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Health record not found'
      });
    }

    // Check if user has permission to update this record
    const canUpdate = req.userType === 'patient' && record.patient_id === req.user.patient_id ||
                     req.userType === 'doctor' && record.uploaded_by === req.user.doctor_id;

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied to update this record'
      });
    }

    // Update record
    const updatedRecord = await record.update({ notes });

    res.status(200).json({
      success: true,
      message: 'Health record updated successfully',
      data: {
        record: updatedRecord.toJSON()
      }
    });
  } catch (error) {
    console.error('Update record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating health record',
      error: error.message
    });
  }
};

// Delete record
const deleteRecord = async (req, res) => {
  try {
    const { record_id } = req.params;

    const record = await HealthRecord.findById(record_id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Health record not found'
      });
    }

    // Check if user has permission to delete this record
    const canDelete = req.userType === 'patient' && record.patient_id === req.user.patient_id ||
                     req.userType === 'doctor' && record.uploaded_by === req.user.doctor_id;

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied to delete this record'
      });
    }

    // Delete file from filesystem
    const fileDeleted = deleteFile(record.file_url);
    if (!fileDeleted) {
      console.warn(`Failed to delete file: ${record.file_url}`);
    }

    // Delete record from database
    await record.delete();

    res.status(200).json({
      success: true,
      message: 'Health record deleted successfully'
    });
  } catch (error) {
    console.error('Delete record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting health record',
      error: error.message
    });
  }
};

// Get records by date range
const getRecordsByDateRange = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    const records = await HealthRecord.findByDateRange(startDate, endDate, patient_id);

    res.status(200).json({
      success: true,
      message: 'Records retrieved successfully',
      data: {
        records: records.map(record => record.toJSON()),
        total: records.length,
        start_date: startDate,
        end_date: endDate
      }
    });
  } catch (error) {
    console.error('Get records by date range error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving records by date range',
      error: error.message
    });
  }
};

module.exports = {
  uploadRecord,
  createRecord,
  getPatientRecords,
  getRecord,
  downloadRecord,
  updateRecord,
  deleteRecord,
  getRecordsByDateRange
};
