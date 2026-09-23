const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { 
  validatePatientRegistration, 
  validateDoctorRegistration, 
  validatePharmacistRegistration,
  validateLogin 
} = require('../middleware/validation');

// Public routes
router.post('/login', validateLogin, authController.login);
router.post('/patient/register', validatePatientRegistration, authController.registerPatient);
router.post('/doctor/register', validateDoctorRegistration, authController.registerDoctor);
router.post('/pharmacist/register', validatePharmacistRegistration, authController.registerPharmacist);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/change-password', authenticateToken, authController.changePassword);

module.exports = router;


