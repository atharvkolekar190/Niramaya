const bcrypt = require('bcryptjs');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Pharmacist = require('../models/Pharmacist');
const { generateToken } = require('../middleware/auth');

// Patient Registration
const registerPatient = async (req, res) => {
  try {
    const { name, email, password, phone, age, gender, address } = req.body;

    // Check if patient already exists
    const existingPatient = await Patient.findByEmail(email);
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: 'Patient with this email already exists'
      });
    }

    // Create patient (password will be hashed in the model)
    const patientData = {
      name,
      email,
      password,
      phone,
      age,
      gender,
      address
    };

    const patient = await Patient.create(patientData);

    // Generate JWT token
    const token = generateToken(patient.patient_id, 'patient');

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: {
        patient: patient.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering patient',
      error: error.message
    });
  }
};

// Doctor Registration
const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, hospital, contact, license_number } = req.body;

    // Check if doctor already exists
    const existingDoctor = await Doctor.findByEmail(email);
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor with this email already exists'
      });
    }

    // Create doctor (password will be hashed in the model)
    const doctorData = {
      name,
      email,
      password,
      specialization,
      hospital,
      phone:contact,
      licenseNumber:license_number
    };

    const doctor = await Doctor.create(doctorData);

    // Generate JWT token
    const token = generateToken(doctor.doctor_id, 'doctor');

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      data: {
        doctor: doctor.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering doctor',
      error: error.message
    });
  }
};

// Pharmacist Registration
const registerPharmacist = async (req, res) => {
  try {
    const { name, email, password, pharmacy_name, license_number, contact, address } = req.body;

    // Check if pharmacist already exists
    const existingPharmacist = await Pharmacist.findByEmail(email);
    if (existingPharmacist) {
      return res.status(400).json({
        success: false,
        message: 'Pharmacist with this email already exists'
      });
    }

    // Map incoming snake_case fields to model's expected camelCase
    // Model expects: phone, licenseNumber, pharmacyName
    const pharmacistData = {
      name,
      email,
      password,
      pharmacyName: pharmacy_name,
      licenseNumber: license_number,
      phone: contact,
      address
    };

    const pharmacist = await Pharmacist.create(pharmacistData);

    // Generate JWT token
    const token = generateToken(pharmacist.pharmacist_id, 'pharmacist');

    res.status(201).json({
      success: true,
      message: 'Pharmacist registered successfully',
      data: {
        pharmacist: pharmacist.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Pharmacist registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering pharmacist',
      error: error.message
    });
  }
};

// Login (for both patients and doctors)
const login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    
    console.log('Login request received:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('UserType:', userType);

    let user = null;
    let userData = null;

    // Find user based on type
    if (userType === 'patient') {
      user = await Patient.findByEmail(email);
    } else if (userType === 'doctor') {
      user = await Doctor.findByEmail(email);
    } else if (userType === 'pharmacist') {
      user = await Pharmacist.findByEmail(email);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type. Must be "patient", "doctor", or "pharmacist"'
      });
    }

    // Check if user exists
    console.log('User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('User email:', user.email);
      console.log('User password hash:', user.password);
    }
    
    if (!user) {
      console.log('No user found for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    let isPasswordValid = false;
    
    console.log('Password verification:');
    console.log('Provided password:', password);
    console.log('Stored password hash:', user.password);
    console.log('Is demo hash?', user.password === '$2b$10$demo.hash.for.testing');
    
    // Check if we're in offline mode (demo data)
    if (user.password === '$2b$10$demo.hash.for.testing') {
      // For demo mode, accept specific demo passwords
      if (email === 'ishank@demo.com' && password === 'password123') {
        isPasswordValid = true;
        console.log('Demo patient password accepted');
      } else if (email === 'pandeyishank123@gmail.com' && password === '123456') {
        isPasswordValid = true;
        console.log('Demo doctor password accepted');
      } else {
        console.log('Demo password rejected for email:', email);
      }
    } else {
      // Normal bcrypt validation for real data
      isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Bcrypt validation result:', isPasswordValid);
    }
    
    console.log('Final password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Password validation failed');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user[`${userType}_id`], userType);

    // Prepare user data (exclude password)
    userData = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token,
        userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: req.user.toJSON(),
        userType: req.userType
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving profile',
      error: error.message
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData[`${req.userType}_id`];
    delete updateData.created_at;

    // Update user
    const updatedUser = await req.user.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser.toJSON()
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, req.user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await req.user.update({ password: hashedNewPassword });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};

module.exports = {
  registerPatient,
  registerDoctor,
  registerPharmacist,
  login,
  getProfile,
  updateProfile,
  changePassword
};
