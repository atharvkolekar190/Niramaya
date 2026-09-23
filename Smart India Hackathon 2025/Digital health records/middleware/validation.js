const Joi = require('joi');

// Patient registration validation
const validatePatientRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(15).required(),
    age: Joi.number().integer().min(0).max(150).required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    address: Joi.string().min(5).max(500).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

// Doctor registration validation
const validateDoctorRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    specialization: Joi.string().min(2).max(100).required(),
    hospital: Joi.string().min(2).max(200).required(),
    contact: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(15).required(),
    license_number: Joi.string().min(5).max(50).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

// Pharmacist registration validation
const validatePharmacistRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    pharmacy_name: Joi.string().min(2).max(200).required(),
    license_number: Joi.string().min(5).max(50).required(),
    contact: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(15).required(),
    address: Joi.string().min(5).max(500).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

// Login validation
const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    userType: Joi.string().valid('patient', 'doctor', 'pharmacist').required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

// Health record upload validation
const validateHealthRecordUpload = (req, res, next) => {
  const schema = Joi.object({
    patient_id: Joi.string().optional(), // Allow patient_id for doctors
    notes: Joi.string().max(1000).optional(),
    encrypted: Joi.boolean().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};


// Patient ID parameter validation
const validatePatientId = (req, res, next) => {
  const schema = Joi.object({
    patient_id: Joi.string().required()
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid patient ID',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

// Record ID parameter validation
const validateRecordId = (req, res, next) => {
  const schema = Joi.object({
    record_id: Joi.string().required()
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid record ID',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

module.exports = {
  validatePatientRegistration,
  validateDoctorRegistration,
  validatePharmacistRegistration,
  validateLogin,
  validateHealthRecordUpload,
  validatePatientId,
  validateRecordId
};
