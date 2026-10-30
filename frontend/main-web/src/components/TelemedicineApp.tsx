import { useEffect, useState, type FormEvent } from 'react';
import { Video, Globe, MessageSquare, Phone, Calendar, Heart, X, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import NiramayaNavbar from './NiramayaNavbar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { authService } from '../services/authService';
import { appointmentsApi, type Appointment, type AppointmentDoctor } from '../services/appointmentsApi';
//

interface TelemedicineAppProps {
  onBack: () => void;
}

export default function TelemedicineApp({ onBack }: TelemedicineAppProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoCallUrl, setVideoCallUrl] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const currentUser = authService.getCurrentUser();
  const [doctors, setDoctors] = useState<AppointmentDoctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [reason, setReason] = useState('');
  const [appointmentMessage, setAppointmentMessage] = useState('');
  const [appointmentError, setAppointmentError] = useState('');
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);

  const loadAppointments = async () => {
    setIsLoadingAppointments(true);
    try {
      const appointmentList = await appointmentsApi.list();
      setAppointments(appointmentList);
    } catch (error) {
      setAppointmentError(error instanceof Error ? error.message : 'Unable to load appointments');
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  useEffect(() => {
    const loadAppointmentData = async () => {
      try {
        if (currentUser?.role === 'patient') {
          const [doctorList] = await Promise.all([appointmentsApi.listDoctors(), loadAppointments()]);
          setDoctors(doctorList);
          if (doctorList.length > 0) setSelectedDoctor(doctorList[0].doctor_id);
        } else if (currentUser?.role === 'doctor') {
          await loadAppointments();
        } else {
          setIsLoadingAppointments(false);
        }
      } catch (error) {
        setAppointmentError(error instanceof Error ? error.message : 'Unable to load appointment data');
        setIsLoadingAppointments(false);
      }
    };

    loadAppointmentData();
  }, [currentUser?.role]);

  const handleBookAppointment = async (event: FormEvent) => {
    event.preventDefault();
    setAppointmentMessage('');
    setAppointmentError('');
    try {
      await appointmentsApi.create({
        doctor_id: selectedDoctor,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        reason
      });
      setAppointmentMessage('Appointment booked successfully.');
      setAppointmentDate('');
      setAppointmentTime('');
      setReason('');
      await loadAppointments();
    } catch (error) {
      setAppointmentError(error instanceof Error ? error.message : 'Unable to book appointment');
    }
  };

  const handleAppointmentStatus = async (appointment: Appointment, status: Appointment['status']) => {
    setAppointmentMessage('');
    setAppointmentError('');
    try {
      await appointmentsApi.updateStatus(appointment.appointment_id, status);
      setSelectedAppointment(null);
      await loadAppointments();
    } catch (error) {
      setAppointmentError(error instanceof Error ? error.message : 'Unable to update appointment');
    }
  };

  const handleStartConsultation = () => {
    // Embed TeleHealth app directly in the main website
    const teleHealthUrl = `http://localhost:5175/?name=Patient&language=${selectedLanguage}&provider=dr-kaur`;
    setVideoCallUrl(teleHealthUrl);
    setShowVideoCall(true);
    setIsMinimized(false);
  };

  const handleEmergencyConsultation = () => {
    // Embed TeleHealth app for emergency consultation
    const teleHealthUrl = `http://localhost:5175/?name=Emergency Patient&language=${selectedLanguage}&provider=dr-kumar&emergency=true`;
    setVideoCallUrl(teleHealthUrl);
    setShowVideoCall(true);
    setIsMinimized(false);
  };

  const handleCloseVideoCall = () => {
    setShowVideoCall(false);
    setVideoCallUrl('');
    setIsMinimized(false);
  };

  const handleMinimizeVideoCall = () => {
    setIsMinimized(!isMinimized);
  };

  const languages = [
    { code: 'english', name: 'English', native: 'English', flag: '🇺🇸' },
    { code: 'hindi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    { code: 'marathi', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <NiramayaNavbar
        activePage="appointments"
        onBack={onBack}
        actions={
          <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLanguageModal(true)}
                className="flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
              >
                <Globe className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">
                  {languages.find(lang => lang.code === selectedLanguage)?.native}
                </span>
              </button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">
            Connect with Healthcare Providers 
            <span className="text-green-600"> Anywhere, Anytime</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Breaking language barriers in healthcare with our multilingual telemedicine platform. 
            Consultations available in Marathi, Hindi, and English.
          </p>
        </div>

        {/* Language Support */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-green-200 bg-green-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">मराठी (Marathi)</h3>
              <small className="text-gray-600">Native language support for comfortable consultations</small>
            </CardContent>
          </Card>

          <Card className="text-center border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">हिंदी (Hindi)</h3>
              <small className="text-gray-600">Wide accessibility with Hindi language support</small>
            </CardContent>
          </Card>

          <Card className="text-center border-purple-200 bg-purple-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">English</h3>
              <small className="text-gray-600">International standard for global accessibility</small>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-green-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Video className="h-5 w-5 text-green-600" />
                </div>
                HD Video Consultations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Crystal clear video calls with healthcare professionals. No appointments needed - 
                connect instantly with available doctors.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Real-time</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">HD Quality</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                Smart Translation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Automatic language detection and real-time translation support. 
                Communicate effectively regardless of language barriers.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">AI-Powered</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">3 Languages</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-purple-600" />
                </div>
                24/7 Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Round-the-clock medical support with emergency consultation options. 
                Healthcare when you need it most.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Emergency</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">24/7</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                Easy Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Simple appointment booking with flexible timing. Schedule consultations 
                that fit your routine and availability.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Flexible</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Instant</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointment Management */}
        {(currentUser?.role === 'patient' || currentUser?.role === 'doctor') && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-gray-900">Appointment Management</h2>
                <p className="text-gray-600 text-sm">
                  {currentUser.role === 'patient'
                    ? 'Book and keep track of your healthcare appointments.'
                    : 'Review patient appointments and update their status.'}
                </p>
              </div>
            </div>

            {appointmentMessage && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
                {appointmentMessage}
              </div>
            )}
            {appointmentError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                {appointmentError}
              </div>
            )}

            {currentUser.role === 'patient' && (
              <Card className="mb-6 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Book an appointment</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBookAppointment} className="grid gap-4 md:grid-cols-2">
                    <label className="text-sm text-gray-700">
                      Doctor
                      <select
                        value={selectedDoctor}
                        onChange={(event) => setSelectedDoctor(event.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                        required
                      >
                        {doctors.map((doctor) => (
                          <option key={doctor.doctor_id} value={doctor.doctor_id}>
                            Dr. {doctor.name} - {doctor.specialization || 'General Medicine'}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-sm text-gray-700">
                      Date
                      <input
                        type="date"
                        value={appointmentDate}
                        min={new Date().toISOString().slice(0, 10)}
                        onChange={(event) => setAppointmentDate(event.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                        required
                      />
                    </label>
                    <label className="text-sm text-gray-700">
                      Time
                      <input
                        type="time"
                        value={appointmentTime}
                        onChange={(event) => setAppointmentTime(event.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                        required
                      />
                    </label>
                    <label className="text-sm text-gray-700 md:col-span-2">
                      Reason for visit (optional)
                      <textarea
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        maxLength={500}
                        rows={2}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                      />
                    </label>
                    <div className="md:col-span-2">
                      <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={doctors.length === 0}>
                        Book appointment
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  {currentUser.role === 'patient' ? 'My appointments' : 'Patient appointments'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingAppointments ? (
                  <p className="text-gray-600">Loading appointments...</p>
                ) : appointments.length === 0 ? (
                  <p className="text-gray-600">No appointments found.</p>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((appointment) => (
                      <button
                        key={appointment.appointment_id}
                        type="button"
                        onClick={() => setSelectedAppointment(appointment)}
                        className="w-full rounded-lg border border-gray-200 p-4 text-left hover:border-green-400 hover:bg-green-50"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-medium text-gray-900">
                              {currentUser.role === 'patient'
                                ? `Dr. ${appointment.doctor?.name || 'Assigned doctor'}`
                                : appointment.patient?.name || 'Patient'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {appointment.appointment_date} at {appointment.appointment_time}
                            </p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                            appointment.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : appointment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-700'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedAppointment && (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Appointment details</h3>
                    <p className="mt-1 text-sm text-gray-700">
                      {selectedAppointment.appointment_date} at {selectedAppointment.appointment_time}
                    </p>
                    <p className="text-sm text-gray-700">Status: {selectedAppointment.status}</p>
                    {selectedAppointment.reason && (
                      <p className="mt-2 text-sm text-gray-700">Reason: {selectedAppointment.reason}</p>
                    )}
                    {selectedAppointment.notes && (
                      <p className="mt-1 text-sm text-gray-700">Notes: {selectedAppointment.notes}</p>
                    )}
                  </div>
                  <button type="button" onClick={() => setSelectedAppointment(null)} aria-label="Close appointment details">
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                {currentUser.role === 'doctor' && selectedAppointment.status === 'scheduled' && (
                  <div className="mt-4 flex gap-2">
                    <Button type="button" className="bg-green-600 hover:bg-green-700" onClick={() => handleAppointmentStatus(selectedAppointment, 'completed')}>
                      Mark completed
                    </Button>
                    <Button type="button" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50" onClick={() => handleAppointmentStatus(selectedAppointment, 'cancelled')}>
                      Cancel appointment
                    </Button>
                  </div>
                )}
                {currentUser.role === 'patient' && selectedAppointment.status === 'scheduled' && (
                  <div className="mt-4">
                    <Button type="button" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50" onClick={() => handleAppointmentStatus(selectedAppointment, 'cancelled')}>
                      Cancel appointment
                    </Button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}


        {/* Stats Section */}
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">247</div>
                <p className="text-green-100">Consultations Completed</p>
              </div>
              <div>
                <div className="text-3xl mb-2">12</div>
                <p className="text-green-100">Healthcare Providers</p>
              </div>
              <div>
                <div className="text-3xl mb-2">8</div>
                <p className="text-green-100">Villages Connected</p>
              </div>
              <div>
                <div className="text-3xl mb-2">94%</div>
                <p className="text-green-100">Patient Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">Start a video consultation with healthcare providers today</p>
          <div className="flex justify-center gap-4">
            <Button 
              className="bg-green-600 hover:bg-green-700 px-8 py-3"
              onClick={() => handleStartConsultation()}
            >
              <Video className="h-5 w-5 mr-2" />
              Start Video Consultation
            </Button>
            <Button 
              variant="outline" 
              className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3"
              onClick={() => handleEmergencyConsultation()}
            >
              <Heart className="h-5 w-5 mr-2" />
              Emergency Consultation
            </Button>
          </div>
        </div>
      </div>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowLanguageModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Select Language</h3>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLanguage(lang.code);
                    setShowLanguageModal(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedLanguage === lang.code
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{lang.flag}</span>
                    <div>
                      <div className="font-medium">{lang.native}</div>
                      <div className="text-sm text-gray-600">{lang.name}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Integrated Video Call Interface */}
      {showVideoCall && (
        <div className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center ${isMinimized ? 'hidden' : ''}`}>
          <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-7xl max-h-[90vh] m-4 flex flex-col">
            {/* Video Call Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Video className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Video Consultation</h3>
                <div className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  Connected to {selectedLanguage === 'english' ? 'Dr. Kaur' : selectedLanguage === 'hindi' ? 'डॉ. कौर' : 'ਡਾ. ਕੌਰ'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMinimizeVideoCall}
                  className="hover:bg-gray-100"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseVideoCall}
                  className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Video Call Content */}
            <div className="flex-1 relative">
              <iframe
                src={videoCallUrl}
                className="w-full h-full border-0 rounded-b-lg"
                title="Video Consultation"
                allow="camera; microphone; display-capture; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Minimized Video Call Bar */}
      {showVideoCall && isMinimized && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
            <Video className="h-4 w-4" />
            <span className="text-sm font-medium">Video Call Active</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMinimizeVideoCall}
              className="text-white hover:bg-green-700 p-1 h-auto"
            >
              Expand
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseVideoCall}
              className="text-white hover:bg-red-600 p-1 h-auto"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}