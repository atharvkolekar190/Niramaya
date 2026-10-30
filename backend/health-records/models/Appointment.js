const { db } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');

const APPOINTMENT_STATUSES = ['scheduled', 'completed', 'cancelled'];

class Appointment {
  constructor(data) {
    Object.assign(this, data);
  }

  static isDbAvailable() {
    return !!db;
  }

  static async create(appointmentData) {
    if (!this.isDbAvailable()) {
      throw new Error('Firebase database not available');
    }

    const appointment = {
      appointment_id: uuidv4(),
      patient_id: appointmentData.patient_id,
      doctor_id: appointmentData.doctor_id,
      appointment_date: appointmentData.appointment_date,
      appointment_time: appointmentData.appointment_time,
      reason: appointmentData.reason || '',
      status: 'scheduled',
      notes: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const docRef = db.collection('appointments').doc(appointment.appointment_id);
    await db.runTransaction(async (transaction) => {
      const duplicateSnapshot = await transaction.get(
        db.collection('appointments')
          .where('doctor_id', '==', appointment.doctor_id)
          .where('appointment_date', '==', appointment.appointment_date)
          .where('appointment_time', '==', appointment.appointment_time)
      );

      const activeBookings = duplicateSnapshot.docs
        .map((doc) => doc.data())
        .filter((data) => data.status !== 'cancelled');

      if (activeBookings.length > 0) {
        const error = new Error(
          activeBookings.some((data) => data.patient_id === appointment.patient_id)
            ? 'You already have an appointment at this time'
            : 'This appointment slot is already booked'
        );
        error.code = activeBookings.some((data) => data.patient_id === appointment.patient_id)
          ? 'DUPLICATE_BOOKING'
          : 'SLOT_UNAVAILABLE';
        throw error;
      }

      transaction.set(docRef, appointment);
    });

    return new Appointment({ id: docRef.id, ...appointment });
  }

  static async findById(appointmentId) {
    if (!this.isDbAvailable()) {
      throw new Error('Firebase database not available');
    }

    const snapshot = await db.collection('appointments')
      .where('appointment_id', '==', appointmentId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return new Appointment({ id: doc.id, ...doc.data() });
  }

  static async findForPatient(patientId) {
    return this.findByOwner('patient_id', patientId);
  }

  static async findForDoctor(doctorId) {
    return this.findByOwner('doctor_id', doctorId);
  }

  static async findByOwner(field, value) {
    if (!this.isDbAvailable()) {
      throw new Error('Firebase database not available');
    }

    const snapshot = await db.collection('appointments')
      .where(field, '==', value)
      .get();

    return snapshot.docs
      .map((doc) => new Appointment({ id: doc.id, ...doc.data() }))
      .sort((a, b) => `${a.appointment_date}T${a.appointment_time}`.localeCompare(`${b.appointment_date}T${b.appointment_time}`));
  }

  async updateStatus(status, notes) {
    if (!Appointment.isDbAvailable()) {
      throw new Error('Firebase database not available');
    }

    const updatePayload = {
      status,
      updated_at: new Date().toISOString()
    };

    if (notes !== undefined) {
      updatePayload.notes = notes;
    }

    await db.collection('appointments').doc(this.id).update(updatePayload);
    Object.assign(this, updatePayload);
    return this;
  }

  toJSON() {
    return { ...this };
  }
}

Appointment.STATUSES = APPOINTMENT_STATUSES;

module.exports = Appointment;
