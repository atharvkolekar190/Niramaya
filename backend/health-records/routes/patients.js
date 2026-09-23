const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { authenticateToken, requireDoctor } = require('../middleware/auth');

// Get all patients (doctor only)
router.get('/', authenticateToken, requireDoctor, async (req, res) => {
  try {
    const patients = await Patient.findAll();
    
    res.status(200).json({
      success: true,
      message: 'Patients retrieved successfully',
      data: patients.map(patient => patient.toJSON())
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving patients',
      error: error.message
    });
  }
});

// Get patient by ID
router.get('/:patient_id', authenticateToken, async (req, res) => {
  try {
    const { patient_id } = req.params;
    const patient = await Patient.findById(patient_id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Patient retrieved successfully',
      data: patient.toJSON()
    });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving patient',
      error: error.message
    });
  }
});

// Search patients
router.get('/search', authenticateToken, requireDoctor, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    // Get all patients and filter in memory (Firestore doesn't support complex text search)
    const allPatients = await Patient.findAll(100); // Get more patients for search
    const searchTerm = q.toLowerCase();
    
    const filteredPatients = allPatients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm) ||
      patient.phone.includes(searchTerm) ||
      patient.address.toLowerCase().includes(searchTerm)
    );
    
    res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: filteredPatients.map(patient => patient.toJSON())
    });
  } catch (error) {
    console.error('Search patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching patients',
      error: error.message
    });
  }
});

module.exports = router;
