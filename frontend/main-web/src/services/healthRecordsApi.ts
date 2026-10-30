// Health Records API Service
// Handles communication with the Digital Health Records backend

export interface HealthRecord {
  record_id: string;
  patient_id: string;
  uploaded_by: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  notes: string;
  encrypted: boolean;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  address: string;
  user_type: 'patient' | 'doctor';
  specialization?: string;
  hospital?: string;
  license_number?: string;
  contact?: string;
  role?: 'patient' | 'doctor' | 'pharmacist';
}

// Align temporary ApiUser alias with User to satisfy type use below
type ApiUser = User;

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    userType: string;
  };
}

export interface RecordsResponse {
  success: boolean;
  message: string;
  data: {
    records: HealthRecord[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface EHRFolder {
  folder_id: string;
  owner_patient_id: string;
  member_type: string;
  name: string;
  profile: Record<string, string | number>;
  sharing_code: string;
  created_at: string;
  updated_at: string;
}

export interface EHRShare {
  share_id: string;
  folder_id: string;
  doctor_id: string;
  status: 'active' | 'expired' | 'revoked';
  expires_at: string;
  created_at: string;
  revoked_at?: string | null;
}

export interface EHRNotification {
  notification_id: string;
  share_id: string;
  folder_id: string;
  patient_name: string;
  folder_name: string;
  shared_at: string;
  expires_at: string;
  access_status: 'active' | 'expired' | 'revoked';
  read_at?: string | null;
}

class HealthRecordsApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    // Use environment variable or default to localhost
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    this.token = localStorage.getItem('health_records_token');
  }

  // Set authentication token
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('health_records_token', token);
  }

  // Clear authentication token
  clearToken(): void {
    this.token = null;
    localStorage.removeItem('health_records_token');
  }

  // Get headers for API requests
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const body = await response.text();
    let data: any = {};

    if (body.trim()) {
      try {
        data = JSON.parse(body);
      } catch {
        data = { success: false, message: `Server returned an invalid response (${response.status})` };
      }
    }

    if (!response.ok) {
      const details = Array.isArray(data.errors) ? `: ${data.errors.join(', ')}` : '';
      const message = `${data.message || `Request failed with status ${response.status}`}${details}`;
      throw new Error(message);
    }

    return data as T;
  }

  // Check if API is available
  async checkApiHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log('API health check failed:', error);
      return false;
    }
  }

  // Authentication endpoints
  async login(email: string, password: string, userType: 'patient' | 'doctor' | 'pharmacist'): Promise<AuthResponse> {
    try {
      // If pharmacist, use the Flask API
      if (userType === 'pharmacist') {
        const response = await fetch('http://localhost:5001/api/pharmacist/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await this.parseResponse<any>(response);
        
        if (data.status === 'success' && data.token) {
          // Transform Flask API response to match our AuthResponse format
          const transformedResponse: AuthResponse = {
            success: true,
            message: data.message,
            data: {
              user: {
                id: data.pharmacist.id.toString(),
                name: data.pharmacist.name,
                email: data.pharmacist.email,
                phone: data.pharmacist.phone || '',
                age: 0,
                gender: '',
                address: '',
                user_type: 'pharmacist' as any,
                role: 'pharmacist',
                pharmacy_name: data.pharmacist.pharmacy_name,
                pharmacy_id: data.pharmacist.pharmacy_id,
              },
              token: data.token,
              userType: 'pharmacist'
            }
          };
          
          // Store pharmacist token separately
          localStorage.setItem('pharmacist_token', data.token);
          return transformedResponse;
        } else {
          return {
            success: false,
            message: data.error || 'Pharmacist login failed',
            data: { user: {} as ApiUser, token: '', userType: '' }
          };
        }
      }
      
      // Existing logic for patient and doctor login
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // increase to 20s to avoid premature aborts on slow networks
      
      const requestBody = { email, password, userType };
      console.log('healthRecordsApi: Sending login request to:', `${this.baseUrl}/api/auth/login`);
      console.log('healthRecordsApi: Email:', email);
      console.log('healthRecordsApi: Password:', password);
      console.log('healthRecordsApi: UserType:', userType);
      
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('healthRecordsApi: Response status:', response.status);
      const data = await this.parseResponse<AuthResponse>(response);
      console.log('healthRecordsApi: Response success:', data.success);
      console.log('healthRecordsApi: Response message:', data.message);
      if (data.data) {
        console.log('healthRecordsApi: Response data keys:', Object.keys(data.data));
      }
      
      if (data.success && data.data.token) {
        this.setToken(data.data.token);
      }

      return data;
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: 'Connection failed. Please check your internet connection.',
        data: { user: {} as ApiUser, token: '', userType: '' }
      };
    }
  }

  async registerPatient(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    address: string;
  }): Promise<AuthResponse> {
    console.log('healthRecordsApi: Registering patient with data:', userData);
    const response = await fetch(`${this.baseUrl}/api/auth/patient/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    const data = await this.parseResponse<AuthResponse>(response);
    console.log('healthRecordsApi: Patient registration response:', { status: response.status, data });
    
    if (!response.ok) {
      console.error('Patient registration failed:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      console.error('Full error details:', JSON.stringify(data, null, 2));
    }
    
    if (data.success && data.data.token) {
      this.setToken(data.data.token);
    }

    return data;
  }

  async registerDoctor(userData: {
    name: string;
    email: string;
    password: string;
    specialization: string;
    hospital: string;
    contact: string;
    license_number: string;
  }): Promise<AuthResponse> {
    console.log('healthRecordsApi: Registering doctor with data:', userData);
    const response = await fetch(`${this.baseUrl}/api/auth/doctor/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    const data = await this.parseResponse<AuthResponse>(response);
    console.log('healthRecordsApi: Doctor registration response:', { status: response.status, data });
    
    if (!response.ok) {
      console.error('Doctor registration failed:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      console.error('Full error details:', JSON.stringify(data, null, 2));
    }
    
    if (data.success && data.data.token) {
      this.setToken(data.data.token);
    }

    return data;
  }

  async registerPharmacist(userData: {
    name: string;
    email: string;
    password: string;
    pharmacy_name: string;
    license_number: string;
    contact: string; // frontend uses 'contact'
    address: string;
  }): Promise<AuthResponse> {
    try {
      console.log('healthRecordsApi: Registering pharmacist with data:', userData);
      
      // Use Flask API for pharmacist registration
      const response = await fetch('http://localhost:5001/api/pharmacist/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          pharmacy_name: userData.pharmacy_name,
          pharmacy_location: userData.address, // Using address as location
          pharmacy_address: userData.address,
          phone: userData.contact,
        }),
      });

      const data = await this.parseResponse<any>(response);
      console.log('healthRecordsApi: Pharmacist registration response:', { status: response.status, data });
      
      if (data.status === 'success' && data.token) {
        // Transform Flask API response to match our AuthResponse format
        const transformedResponse: AuthResponse = {
          success: true,
          message: data.message,
          data: {
            user: {
              id: data.pharmacist.id.toString(),
              name: data.pharmacist.name,
              email: data.pharmacist.email,
              phone: data.pharmacist.phone || '',
              age: 0,
              gender: '',
              address: userData.address,
              user_type: 'pharmacist' as any,
              role: 'pharmacist',
              pharmacy_name: data.pharmacist.pharmacy_name,
              pharmacy_id: data.pharmacist.pharmacy_id,
            },
            token: data.token,
            userType: 'pharmacist'
          }
        };
        
        // Store pharmacist token separately
        localStorage.setItem('pharmacist_token', data.token);
        return transformedResponse;
      } else {
        return {
          success: false,
          message: data.error || 'Pharmacist registration failed',
          data: { user: {} as ApiUser, token: '', userType: '' }
        };
      }
    } catch (error) {
      console.error('Pharmacist registration error:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.',
        data: { user: {} as ApiUser, token: '', userType: '' }
      };
    }
  }

  async getProfile(): Promise<{ success: boolean; data: { user: User; userType: string } }> {
    const response = await fetch(`${this.baseUrl}/api/auth/profile`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.parseResponse(response);
  }

  async updateProfile(updateData: Partial<User>): Promise<{ success: boolean; data: { user: User } }> {
    const response = await fetch(`${this.baseUrl}/api/auth/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updateData),
    });

    return this.parseResponse(response);
  }

  // Health Records endpoints
  async uploadRecord(
    file: File,
    patientId: string,
    notes: string = '',
    encrypted: boolean = false,
    folderId?: string
  ): Promise<{ success: boolean; data: { record: HealthRecord } }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patient_id', patientId);
    formData.append('notes', notes);
    formData.append('encrypted', encrypted.toString());
    if (folderId) formData.append('folder_id', folderId);

    const response = await fetch(`${this.baseUrl}/api/records/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    return this.parseResponse(response);
  }

  async getPatientRecords(
    patientId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<RecordsResponse> {
    const response = await fetch(
      `${this.baseUrl}/api/records/${patientId}?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: this.getHeaders(),
      }
    );

    return this.parseResponse(response);
  }

  async getRecord(recordId: string): Promise<{ success: boolean; data: { record: HealthRecord } }> {
    const response = await fetch(`${this.baseUrl}/api/records/record/${recordId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.parseResponse(response);
  }

  async downloadRecord(recordId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/records/download/${recordId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const body = await response.text();
      let message = `Failed to download record (${response.status})`;
      try {
        const data = JSON.parse(body);
        message = data.message || message;
      } catch {
        // Preserve the status-based message for non-JSON error responses.
      }
      throw new Error(message);
    }

    return response.blob();
  }

  async updateRecord(recordId: string, notes: string): Promise<{ success: boolean; data: { record: HealthRecord } }> {
    const response = await fetch(`${this.baseUrl}/api/records/${recordId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ notes }),
    });

    return this.parseResponse(response);
  }

  async deleteRecord(recordId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/api/records/${recordId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.parseResponse(response);
  }

  async getRecordsByDateRange(
    patientId: string,
    startDate: string,
    endDate: string
  ): Promise<{ success: boolean; data: { records: HealthRecord[] } }> {
    const response = await fetch(
      `${this.baseUrl}/api/records/${patientId}/date-range?start_date=${startDate}&end_date=${endDate}`,
      {
        method: 'GET',
        headers: this.getHeaders(),
      }
    );

    return this.parseResponse(response);
  }

  async getEHRFolders(): Promise<{ success: boolean; message?: string; data: { folders: EHRFolder[] } }> {
    const response = await fetch(`${this.baseUrl}/api/records/folders`, { headers: this.getHeaders() });
    return this.parseResponse(response);
  }

  async createEHRFolder(data: { name: string; member_type: string; profile?: Record<string, string | number | undefined> }): Promise<{ success: boolean; message?: string; data: { folder: EHRFolder } }> {
    const response = await fetch(`${this.baseUrl}/api/records/folders`, {
      method: 'POST', headers: this.getHeaders(), body: JSON.stringify(data)
    });
    return this.parseResponse(response);
  }

  async deleteEHRFolder(folderId: string, confirmDataLoss = false) {
    const response = await fetch(`${this.baseUrl}/api/records/folders/${folderId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      body: JSON.stringify({ confirm_data_loss: confirmDataLoss })
    });
    return this.parseResponse(response);
  }

  async getEHRFolderRecords(folderId: string): Promise<RecordsResponse> {
    const response = await fetch(`${this.baseUrl}/api/records/folders/${folderId}/records`, { headers: this.getHeaders() });
    return this.parseResponse(response);
  }

  async getDoctors(): Promise<{ success: boolean; data: { doctors: User[] } }> {
    const response = await fetch(`${this.baseUrl}/api/records/doctors`, { headers: this.getHeaders() });
    return this.parseResponse(response);
  }

  async shareEHRFolder(folderId: string, doctorId: string) {
    const response = await fetch(`${this.baseUrl}/api/records/folders/${folderId}/share`, {
      method: 'POST', headers: this.getHeaders(), body: JSON.stringify({ doctor_id: doctorId })
    });
    return this.parseResponse(response);
  }

  async getEHRShares(folderId: string): Promise<{ success: boolean; data: { shares: EHRShare[] } }> {
    const response = await fetch(`${this.baseUrl}/api/records/folders/${folderId}/shares`, { headers: this.getHeaders() });
    return this.parseResponse(response);
  }

  async revokeEHRShare(folderId: string, shareId: string) {
    const response = await fetch(`${this.baseUrl}/api/records/folders/${folderId}/shares/${shareId}`, {
      method: 'DELETE', headers: this.getHeaders()
    });
    return this.parseResponse(response);
  }

  async redeemEHRShare(accessKey: string) {
    const response = await fetch(`${this.baseUrl}/api/records/shares/redeem`, {
      method: 'POST', headers: this.getHeaders(), body: JSON.stringify({ access_key: accessKey })
    });
    return this.parseResponse(response);
  }

  async getEHRNotifications(): Promise<{ success: boolean; data: { notifications: EHRNotification[] } }> {
    const response = await fetch(`${this.baseUrl}/api/records/notifications`, { headers: this.getHeaders() });
    return this.parseResponse(response);
  }

  async openEHRNotification(notificationId: string) {
    const response = await fetch(`${this.baseUrl}/api/records/notifications/${notificationId}/open`, {
      method: 'POST', headers: this.getHeaders()
    });
    return this.parseResponse(response);
  }

  async dismissEHRNotification(notificationId: string) {
    const response = await fetch(`${this.baseUrl}/api/records/notifications/${notificationId}`, {
      method: 'DELETE', headers: this.getHeaders()
    });
    return this.parseResponse(response);
  }

  // Get all patients (Doctor only)
  async getAllPatients(
    limit: number = 50,
    offset: number = 0
  ): Promise<{ success: boolean; data: { patients: User[]; total: number; limit: number; offset: number } }> {
    const response = await fetch(
      `${this.baseUrl}/api/patients?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: this.getHeaders(),
      }
    );

    return this.parseResponse(response);
  }

  // Get a single patient by ID (Doctor only)
  async getPatientById(patientId: string): Promise<{ success: boolean; data: { patient: User } }> {
    const response = await fetch(`${this.baseUrl}/api/patients/${patientId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.parseResponse(response);
  }

  // Sync offline records when online
  async syncOfflineRecords(offlineRecords: any[]): Promise<{ success: boolean; synced: string[] }> {
    const syncedIds: string[] = [];
    
    for (const record of offlineRecords) {
      try {
        if (record.operation === 'CREATE_RECORD') {
          // Convert base64 back to file for upload
          const blob = this.base64ToBlob(record.data.file_data, record.data.file_type);
          const file = new File([blob], record.data.file_name, { type: record.data.file_type });
          
          const result = await this.uploadRecord(
            file,
            record.data.patient_id,
            record.data.notes,
            record.data.encrypted
          );
          
          if (result.success) {
            syncedIds.push(record.data.id);
          }
        }
        // Handle other operations (UPDATE, DELETE) as needed
      } catch (error) {
        console.error('Failed to sync record:', error);
      }
    }
    
    return { success: true, synced: syncedIds };
  }

  // Helper method to convert base64 to blob
  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
}

export const healthRecordsApi = new HealthRecordsApiService();
