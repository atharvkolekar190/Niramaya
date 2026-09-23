import { useState, useEffect } from 'react';
import { ArrowLeft, Stethoscope, Users, FileText, Search, Eye, Calendar, Phone, MapPin, User, Shield, Clock, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { healthRecordsApi, type User as ApiUser } from '../services/healthRecordsApi';
import { offlineStorage } from '../services/offlineStorage';
import { authService } from '../services/authService';

interface DoctorDashboardProps {
  onBack: () => void;
  onNavigateToRecords?: (patientId: string) => void;
}

interface PatientData {
  patient_id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  address: string;
  created_at: string;
  updated_at: string;
  recordCount?: number;
  lastVisit?: string;
}

export default function DoctorDashboard({ onBack, onNavigateToRecords }: DoctorDashboardProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isApiAvailable, setIsApiAvailable] = useState(false);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<PatientData[]>([]);
  const [patientLookupKey, setPatientLookupKey] = useState('');
  const [lookupResult, setLookupResult] = useState<PatientData | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [creatingSample, setCreatingSample] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        checkApiHealth();
      }
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    // Initialize token from authService if available
    const token = authService.getToken();
    if (token) {
      healthRecordsApi.setToken(token);
    }

    checkApiHealth();
    loadUserData();
    loadPatients();

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  // Filter patients based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchTerm, patients]);

  const checkApiHealth = async () => {
    try {
      console.log('Checking API health...');
      const isHealthy = await healthRecordsApi.checkApiHealth();
      console.log('API health check result:', isHealthy);
      setIsApiAvailable(isHealthy);
    } catch (error) {
      console.error('API health check failed:', error);
      setIsApiAvailable(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await checkApiHealth();
      await loadUserData();
      await loadPatients();
    } finally {
      setRefreshing(false);
    }
  };

  const loadUserData = async () => {
    try {
      console.log('Loading user data...', { isApiAvailable, token: authService.getToken() });
      
      if (isApiAvailable) {
        const response = await healthRecordsApi.getProfile();
        console.log('Doctor profile response:', response);
        if (response.success && response.data) {
          const userData = response.data.user;
          console.log('Setting user data:', userData);
          setUser({
            id: (userData as any).doctor_id || userData.id,
            name: userData.name || 'Dr. Unknown',
            email: userData.email || '',
            phone: userData.contact || userData.phone || '',
            age: userData.age || 0,
            gender: userData.gender || '',
            address: userData.address || '',
            user_type: 'doctor',
            role: 'doctor',
            specialization: userData.specialization || 'General Medicine',
            hospital: userData.hospital || 'Healthcare Center',
            license_number: userData.license_number || 'LIC-XXXX',
            contact: userData.contact || userData.phone || ''
          });
        } else {
          console.error('Failed to load profile:', (response as any).message);
        }
      } else {
        console.log('API not available, trying direct API call...');
        // Try direct API call even if isApiAvailable is false
        try {
          const response = await healthRecordsApi.getProfile();
          console.log('Direct API call response:', response);
          if (response.success && response.data) {
            const userData = response.data.user;
            console.log('Setting user data from direct call:', userData);
            setUser({
              id: (userData as any).doctor_id || userData.id,
              name: userData.name || 'Dr. Unknown',
              email: userData.email || '',
              phone: userData.contact || userData.phone || '',
              age: userData.age || 0,
              gender: userData.gender || '',
              address: userData.address || '',
              user_type: 'doctor',
              role: 'doctor',
              specialization: userData.specialization || 'General Medicine',
              hospital: userData.hospital || 'Healthcare Center',
              license_number: userData.license_number || 'LIC-XXXX',
              contact: userData.contact || userData.phone || ''
            });
            return; // Exit early if successful
          }
        } catch (directError) {
          console.error('Direct API call failed:', directError);
        }
        
        // Fallback to offline mode if API call fails
        if (offlineStorage.isLoggedInOffline()) {
        const offlineUser = offlineStorage.getUserData();
        if (offlineUser) {
          setUser({
            id: offlineUser.id || '',
            name: offlineUser.name || 'Dr. Unknown',
            email: offlineUser.email || '',
            phone: offlineUser.phone || '',
            age: offlineUser.age || 0,
            gender: offlineUser.gender || '',
            address: offlineUser.address || '',
            user_type: 'doctor' as const,
            role: 'doctor' as const,
            specialization: 'General Medicine',
            hospital: 'Healthcare Center',
            license_number: 'LIC-XXXX',
            contact: offlineUser.phone || ''
          });
        }
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  // Create a sample patient for quick local testing without altering doctor auth token
  const createSamplePatient = async () => {
    try {
      setCreatingSample(true);
      setError(null);
      const baseUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3002';
      const unique = Math.random().toString(36).slice(2, 8);
      const response = await fetch(`${baseUrl}/api/auth/patient/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Demo Patient',
          email: `demo.patient.${unique}@example.com`,
          password: 'Passw0rd!',
          phone: '9999999999',
          age: 30,
          gender: 'male',
          address: 'Demo City'
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create sample patient');
      }
      // Refresh patient list
      await loadPatients();
    } catch (e: any) {
      console.error('Create sample patient failed:', e);
      setError(e.message || 'Failed to create sample patient');
    } finally {
      setCreatingSample(false);
    }
  };

  const loadPatients = async () => {
    try {
      console.log('Loading patients...', { isApiAvailable, token: authService.getToken() });
      
      if (isApiAvailable) {
        // Fetch real patients from backend
        const response = await healthRecordsApi.getAllPatients();
        console.log('Patients response:', response);
        if (response.success && response.data) {
          const patientsData: PatientData[] = response.data.patients.map(patient => ({
            patient_id: patient.id,
            name: patient.name,
            email: patient.email,
            phone: patient.phone || '',
            age: patient.age || 0,
            gender: (patient.gender === 'male' || patient.gender === 'female' || patient.gender === 'other') 
              ? patient.gender : 'other',
            address: patient.address || '',
            created_at: (patient as any).created_at || new Date().toISOString(),
            updated_at: (patient as any).updated_at || new Date().toISOString(),
            recordCount: 0, // Will be updated when we load records
            lastVisit: undefined // Will be updated when we load records
          }));
          
          // Load record counts and last visit dates for each patient
          const patientsWithRecords = await Promise.all(
            patientsData.map(async (patient) => {
              try {
                const recordsResponse = await healthRecordsApi.getPatientRecords(patient.patient_id);
                if (recordsResponse.success && recordsResponse.data) {
                  const records = recordsResponse.data.records;
                  const recordCount = records.length;
                  const lastVisit = records.length > 0 
                    ? records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
                    : undefined;
                  
                  return {
                    ...patient,
                    recordCount,
                    lastVisit
                  };
                }
                return patient;
              } catch (error) {
                console.error(`Failed to load records for patient ${patient.patient_id}:`, error);
                return patient;
              }
            })
          );
          
          setPatients(patientsWithRecords);
          setFilteredPatients(patientsWithRecords);
        } else {
          console.error('Failed to load patients from server:', (response as any).message);
          setError('Failed to load patients from server');
          // Do not use hardcoded demo data; fall back to empty list
          setPatients([]);
          setFilteredPatients([]);
        }
      } else {
        // Offline mode: do not display hardcoded demo data
        setPatients([]);
        setFilteredPatients([]);
      }
    } catch (error) {
      console.error('Failed to load patients:', error);
      setError('Failed to load patients. Please try again.');
    }
  };


  const handlePatientSelect = (patient: PatientData) => {
    setSelectedPatient(patient);
    // Store the selected patient ID for the Digital Health Records component
    localStorage.setItem('selectedPatientId', patient.patient_id);
    console.log('Patient selected:', patient.patient_id, 'Stored in localStorage');
    
    // Navigate to Digital Health Records component
    if (onNavigateToRecords) {
      onNavigateToRecords(patient.patient_id);
    } else {
      // Fallback: dispatch a custom event that the parent can listen to
      const event = new CustomEvent('navigateToRecords', { 
        detail: { patientId: patient.patient_id } 
      });
      window.dispatchEvent(event);
      console.log('Event dispatched for navigation to records');
    }
  };

  const lookupPatient = async () => {
    if (!patientLookupKey.trim()) {
      setLookupError('Please enter a patient lookup key');
      return;
    }

    try {
      setLookupLoading(true);
      setLookupError(null);
      setLookupResult(null);

      if (isApiAvailable) {
        // Try to find patient by ID first
        const response = await healthRecordsApi.getPatientById(patientLookupKey.trim());
        if (response.success && response.data) {
          const patient = response.data as any;
          const patientData: PatientData = {
            patient_id: patient.patient_id,
            name: patient.name,
            email: patient.email || '',
            phone: patient.phone || '',
            age: patient.age || 0,
            gender: (patient.gender === 'male' || patient.gender === 'female' || patient.gender === 'other') 
              ? patient.gender : 'other',
            address: patient.address || '',
            created_at: patient.created_at ? 
              (typeof patient.created_at === 'object' && patient.created_at._seconds ? 
                new Date(patient.created_at._seconds * 1000).toISOString() : 
                patient.created_at.toString()) : 
              new Date().toISOString(),
            updated_at: patient.updated_at ? 
              (typeof patient.updated_at === 'object' && patient.updated_at._seconds ? 
                new Date(patient.updated_at._seconds * 1000).toISOString() : 
                patient.updated_at.toString()) : 
              new Date().toISOString(),
            recordCount: 0,
            lastVisit: undefined
          };

          // Load records for this patient
          try {
            const recordsResponse = await healthRecordsApi.getPatientRecords(patient.patient_id);
            if (recordsResponse.success && recordsResponse.data) {
              const records = recordsResponse.data.records;
              patientData.recordCount = records.length;
              patientData.lastVisit = records.length > 0
                ? records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
                : undefined;
            }
          } catch (error) {
            console.error('Failed to load records for looked up patient:', error);
          }

          setLookupResult(patientData);
        } else {
          setLookupError('Patient not found with the provided key');
        }
      } else {
        setLookupError('Patient lookup is only available when online');
      }
    } catch (error) {
      console.error('Failed to lookup patient:', error);
      setLookupError('Failed to lookup patient. Please check the key and try again.');
    } finally {
      setLookupLoading(false);
    }
  };


  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor Login Required</h2>
            <p className="text-gray-600 mb-6">
              Please log in as a doctor to access the dashboard
            </p>
            <Button onClick={onBack} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Homepage
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl text-gray-900">Doctor Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Refresh API Connection Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing' : 'Refresh'}
              </Button>
              
              {/* Connection Status */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                isOnline && isApiAvailable 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {isOnline && isApiAvailable ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Online
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    Offline
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Doctor Info */}
        <Card className="mb-8 border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Dr. {user.name}</h2>
                  <p className="text-gray-600">
                    {user.specialization} • {user.hospital}
                  </p>
                  <p className="text-sm text-gray-500">
                    License: {user.license_number} • Contact: {user.contact}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {patients.length}
                </div>
                <p className="text-sm text-gray-600">Total Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error and Success Messages */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}


        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="patients">My Patients</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-6">
            {/* Search Patients section removed per request */}

            {/* Patient Lookup by Unique Key */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Shield className="h-5 w-5" />
                  Patient Lookup by Unique Key
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Enter a patient's unique ID to access their health records securely
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter patient unique key or ID"
                    value={patientLookupKey}
                    onChange={(e) => setPatientLookupKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={lookupPatient}
                    disabled={lookupLoading || !patientLookupKey.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {lookupLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Looking up...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Lookup
                      </>
                    )}
                  </Button>
                </div>
                {lookupError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {lookupError}
                  </div>
                )}
                {lookupResult && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                    <h4 className="font-semibold text-green-800 mb-2">Patient Found:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><strong>Name:</strong> {lookupResult.name}</div>
                      <div><strong>Email:</strong> {lookupResult.email}</div>
                      <div><strong>Phone:</strong> {lookupResult.phone}</div>
                      <div><strong>Age:</strong> {lookupResult.age}</div>
                      <div><strong>Gender:</strong> {lookupResult.gender}</div>
                      <div><strong>Records:</strong> {lookupResult.recordCount}</div>
                    </div>
                    <Button
                      onClick={() => handlePatientSelect(lookupResult)}
                      className="mt-3 bg-green-600 hover:bg-green-700"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Records
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Empty/Offline card removed per request */}

            {/* Patients List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <Card 
                  key={patient.patient_id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedPatient?.patient_id === patient.patient_id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handlePatientSelect(patient)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                          <p className="text-sm text-gray-600">{patient.age} years • {patient.gender}</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {patient.recordCount || 0} records
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {patient.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {patient.address}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Last visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Health Records tab removed per request */}
        </Tabs>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-12">
          <Card className="text-center border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Total Patients</h3>
              <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
            </CardContent>
          </Card>

          <Card className="text-center border-green-200 bg-green-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Total Records</h3>
              <p className="text-2xl font-bold text-green-600">
                {patients.reduce((sum, patient) => sum + (patient.recordCount || 0), 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-purple-200 bg-purple-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Recent Visits</h3>
              <p className="text-2xl font-bold text-purple-600">
                {patients.filter(p => p.lastVisit && new Date(p.lastVisit) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-orange-200 bg-orange-50/50">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Secure Access</h3>
              <p className="text-sm text-gray-600">HIPAA Compliant</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
