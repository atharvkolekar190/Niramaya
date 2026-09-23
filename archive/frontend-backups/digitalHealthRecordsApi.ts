// Digital Health Records API Service
// This service handles all communication with the Digital Health Records backend

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3004'; // Digital Health Records backend URL

export interface Patient {
  patient_id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  address: string;
  created_at: string;
  updated_at: string;
}

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

export interface Doctor {
  doctor_id: string;
  name: string;
  email: string;
  specialization: string;
  hospital: string;
  contact: string;
  license_number: string;
  created_at: string;
  updated_at: string;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'pharmacist';
  user_type?: string;
  specialization?: string;
  hospital?: string;
  license_number?: string;
  contact?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class DigitalHealthRecordsApi {
  private token: string | null = null;

  constructor() {
    // Get token from localStorage if available
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Check if API is available
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/health`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Authentication methods
  async login(email: string, password: string, userType: 'patient' | 'doctor' | 'pharmacist'): Promise<ApiResponse<{ user: any; token: string }>> {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email, password, userType }),
      });

      const data = await response.json();
      
      if (data.success && data.data?.token) {
        this.setToken(data.data.token);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getProfile(): Promise<ApiResponse<{ user: any; userType: string }>> {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: 'Failed to get profile',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Patient management methods
  async getAllPatients(): Promise<ApiResponse<Patient[]>> {
    try {
      const response = await fetch(`${BASE_URL}/api/patients`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Get patients error:', error);
      return {
        success: false,
        message: 'Failed to fetch patients',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getPatientById(patientId: string): Promise<ApiResponse<Patient>> {
    try {
      const response = await fetch(`${BASE_URL}/api/patients/${patientId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Get patient error:', error);
      return {
        success: false,
        message: 'Failed to fetch patient',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Health records methods
  async getPatientRecords(patientId: string): Promise<ApiResponse<HealthRecord[]>> {
    try {
      const response = await fetch(`${BASE_URL}/api/records/${patientId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Get patient records error:', error);
      return {
        success: false,
        message: 'Failed to fetch patient records',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getRecordById(recordId: string): Promise<ApiResponse<HealthRecord>> {
    try {
      const response = await fetch(`${BASE_URL}/api/records/record/${recordId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Get record error:', error);
      return {
        success: false,
        message: 'Failed to fetch record',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async uploadRecord(patientId: string, file: File, notes: string = ''): Promise<ApiResponse<HealthRecord>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patient_id', patientId);
      formData.append('notes', notes);

      const response = await fetch(`${BASE_URL}/api/records/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
        body: formData,
      });

      return await response.json();
    } catch (error) {
      console.error('Upload record error:', error);
      return {
        success: false,
        message: 'Failed to upload record',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async updateRecord(recordId: string, notes: string): Promise<ApiResponse<HealthRecord>> {
    try {
      const response = await fetch(`${BASE_URL}/api/records/${recordId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ notes }),
      });

      return await response.json();
    } catch (error) {
      console.error('Update record error:', error);
      return {
        success: false,
        message: 'Failed to update record',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async deleteRecord(recordId: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await fetch(`${BASE_URL}/api/records/${recordId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Delete record error:', error);
      return {
        success: false,
        message: 'Failed to delete record',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async downloadRecord(recordId: string): Promise<Blob | null> {
    try {
      const response = await fetch(`${BASE_URL}/api/records/download/${recordId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      return await response.blob();
    } catch (error) {
      console.error('Download record error:', error);
      return null;
    }
  }

  // Search and filter methods
  async searchPatients(query: string): Promise<ApiResponse<Patient[]>> {
    try {
      const response = await fetch(`${BASE_URL}/api/patients/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Search patients error:', error);
      return {
        success: false,
        message: 'Failed to search patients',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getRecordsByDateRange(patientId: string, startDate: string, endDate: string): Promise<ApiResponse<HealthRecord[]>> {
    try {
      const response = await fetch(`${BASE_URL}/api/records/${patientId}/date-range?start=${startDate}&end=${endDate}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('Get records by date range error:', error);
      return {
        success: false,
        message: 'Failed to fetch records by date range',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Utility methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getFileIcon(fileType: string): string {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('text')) return '📝';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    return '📁';
  }
}

// Create and export a singleton instance
export const digitalHealthRecordsApi = new DigitalHealthRecordsApi();
export default digitalHealthRecordsApi;
