const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('Auth middleware - Token received:', token ? 'Yes' : 'No');
    console.log('Auth middleware - JWT_SECRET available:', process.env.JWT_SECRET ? 'Yes' : 'No');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Token decoded successfully:', decoded);
    
    // Determine user type and fetch user data
    let user = null;
    if (decoded.userType === 'patient') {
      user = await Patient.findById(decoded.userId);
    } else if (decoded.userType === 'doctor') {
      user = await Doctor.findById(decoded.userId);
    }

    // If user not found in database, create demo user for offline mode
    if (!user) {
      console.log('User not found in database, creating demo user for offline mode');
      if (decoded.userType === 'patient' && decoded.userId === 'TeuLE4SQBO0bC7TN4lxo') {
        user = new Patient({
          patient_id: 'TeuLE4SQBO0bC7TN4lxo',
          name: 'Ishank Pandey',
          email: 'ishank@demo.com',
          phone: '+91-9876543210',
          age: 25,
          gender: 'male',
          address: 'Nabha, Punjab',
          created_at: new Date(),
          updated_at: new Date()
        });
      } else if (decoded.userType === 'doctor' && decoded.userId === 'mfffXHFPwdwn0ZqjHnLK') {
        user = new Doctor({
          doctor_id: 'mfffXHFPwdwn0ZqjHnLK',
          name: 'Ishank',
          email: 'pandeyishank123@gmail.com',
          specialization: 'General Medicine',
          hospital: 'AIIMS',
          contact: '7455800398',
          license_number: '12345',
          created_at: new Date(),
          updated_at: new Date()
        });
      } else {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication error' 
        });
      }
    }

    req.user = user;
    req.userType = decoded.userType;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

// Middleware to check if user is a patient
const requirePatient = (req, res, next) => {
  if (req.userType !== 'patient') {
    return res.status(403).json({ 
      success: false, 
      message: 'Patient access required' 
    });
  }
  next();
};

// Middleware to check if user is a doctor
const requireDoctor = (req, res, next) => {
  if (req.userType !== 'doctor') {
    return res.status(403).json({ 
      success: false, 
      message: 'Doctor access required' 
    });
  }
  next();
};

// Middleware to check if user is either patient or doctor
const requirePatientOrDoctor = (req, res, next) => {
  if (req.userType !== 'patient' && req.userType !== 'doctor') {
    return res.status(403).json({ 
      success: false, 
      message: 'Patient or Doctor access required' 
    });
  }
  next();
};


// Generate JWT token
const generateToken = (userId, userType) => {
  return jwt.sign(
    { userId, userType },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

module.exports = {
  authenticateToken,
  requirePatient,
  requireDoctor,
  requirePatientOrDoctor,
  generateToken
};
