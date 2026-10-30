const express = require('express');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const {
  authenticateToken,
  requirePatient,
  requireDoctor,
  requirePatientOrDoctor
} = require('../middleware/auth');

const router = express.Router();

const isValidDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

const isValidTime = (value) => /^\d{2}:\d{2}$/.test(value) && Number(value.slice(0, 2)) < 24 && Number(value.slice(3)) < 60;

const serializeAppointment = async (appointment) => {
  const [patient, doctor] = await Promise.all([
    Patient.findById(appointment.patient_id),
    Doctor.findById(appointment.doctor_id)
  ]);

  return {
    ...appointment.toJSON(),
    patient: patient ? { patient_id: patient.patient_id, name: patient.name, email: patient.email } : null,
    doctor: doctor ? { doctor_id: doctor.doctor_id, name: doctor.name, specialization: doctor.specialization } : null
  };
};

router.use(authenticateToken);

router.get('/doctors', requirePatient, async (req, res, next) => {
  try {
    const doctors = await Doctor.findAll();
    res.json({
      success: true,
      data: doctors.map((doctor) => ({
        doctor_id: doctor.doctor_id,
        name: doctor.name,
        specialization: doctor.specialization,
        hospital: doctor.hospital
      }))
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', requirePatient, async (req, res, next) => {
  try {
    const { doctor_id, appointment_date, appointment_time, reason } = req.body;

    if (!doctor_id || !isValidDate(appointment_date) || !isValidTime(appointment_time)) {
      return res.status(400).json({
        success: false,
        message: 'Doctor, a valid appointment date, and a valid appointment time are required'
      });
    }

    const requestedDateTime = new Date(`${appointment_date}T${appointment_time}`);
    if (requestedDateTime <= new Date()) {
      return res.status(400).json({ success: false, message: 'Appointment must be scheduled in the future' });
    }

    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const appointment = await Appointment.create({
      patient_id: req.user.patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      reason: typeof reason === 'string' ? reason.trim().slice(0, 500) : ''
    });

    res.status(201).json({ success: true, data: await serializeAppointment(appointment) });
  } catch (error) {
    if (error.code === 'SLOT_UNAVAILABLE' || error.code === 'DUPLICATE_BOOKING') {
      return res.status(409).json({ success: false, message: error.message });
    }
    next(error);
  }
});

router.get('/', requirePatientOrDoctor, async (req, res, next) => {
  try {
    const appointments = req.userType === 'patient'
      ? await Appointment.findForPatient(req.user.patient_id)
      : await Appointment.findForDoctor(req.user.doctor_id);

    res.json({
      success: true,
      data: await Promise.all(appointments.map(serializeAppointment))
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:appointmentId', requirePatientOrDoctor, async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const ownsAppointment = req.userType === 'patient'
      ? appointment.patient_id === req.user.patient_id
      : appointment.doctor_id === req.user.doctor_id;

    if (!ownsAppointment) {
      return res.status(403).json({ success: false, message: 'You do not have access to this appointment' });
    }

    res.json({ success: true, data: await serializeAppointment(appointment) });
  } catch (error) {
    next(error);
  }
});

router.patch('/:appointmentId/status', requirePatientOrDoctor, async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    if (!Appointment.STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment status' });
    }

    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    const isDoctor = req.userType === 'doctor';
    const isPatient = req.userType === 'patient';
    const ownsAppointment = isDoctor
      ? appointment.doctor_id === req.user.doctor_id
      : appointment.patient_id === req.user.patient_id;

    if (!ownsAppointment || (isPatient && (status !== 'cancelled' || appointment.status !== 'scheduled'))) {
      return res.status(403).json({ success: false, message: 'You do not have access to this appointment' });
    }

    await appointment.updateStatus(status, typeof notes === 'string' ? notes.trim().slice(0, 500) : undefined);
    res.json({ success: true, data: await serializeAppointment(appointment) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
