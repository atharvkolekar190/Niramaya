import { healthRecordsApi } from './healthRecordsApi';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'patient' | 'doctor' | 'pharmacist';
  // Patient specific fields
  age?: number;
  gender?: string;
  address?: string;
  // Doctor specific fields
  specialization?: string;
  hospital?: string;
  license_number?: string;
  // Pharmacist specific fields
  pharmacy_name?: string;
  pharmacy_id?: number;
  license?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    userType: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
  userType: 'patient' | 'doctor' | 'pharmacist';
}

export interface PatientRegistrationData {
  name: string;
  email: string;
  password: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  address: string;
}

export interface DoctorRegistrationData {
  name: string;
  email: string;
  password: string;
  specialization: string;
  hospital: string;
  contact: string;
  license_number: string;
}

export interface PharmacistRegistrationData {
  name: string;
  email: string;
  password: string;
  pharmacy_name: string;
  license_number: string;
  contact: string;
  address: string;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
    this.user = this.getStoredUser();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.user;
  }

  // Get auth token
  getToken(): string | null {
    return this.token;
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await healthRecordsApi.login(
        credentials.email,
        credentials.password,
        credentials.userType
      );

      if (response.success && response.data) {
        this.token = response.data.token;
        
        // Handle pharmacist data differently
        if (credentials.userType === 'pharmacist') {
          this.user = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            phone: response.data.user.phone,
            role: 'pharmacist',
            pharmacy_name: response.data.user.pharmacy_name,
            pharmacy_id: response.data.user.pharmacy_id,
          };
        } else {
          this.user = {
            id: response.data.user.patient_id || response.data.user.doctor_id || response.data.user.pharmacist_id,
            name: response.data.user.name,
            email: response.data.user.email,
            phone: response.data.user.phone || response.data.user.contact,
            role: credentials.userType,
            age: response.data.user.age,
            gender: response.data.user.gender,
            address: response.data.user.address,
            specialization: response.data.user.specialization,
            hospital: response.data.user.hospital,
            license_number: response.data.user.license_number,
            pharmacy_name: response.data.user.pharmacyName,
            license: response.data.user.licenseNumber,
          };
        }

        // Store in localStorage
        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('user_data', JSON.stringify(this.user));
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.',
      };
    }
  }

  // Register patient
  async registerPatient(userData: PatientRegistrationData): Promise<AuthResponse> {
    try {
      console.log('AuthService: Registering patient with data:', userData);
      const response = await healthRecordsApi.registerPatient(userData);
      console.log('AuthService: Patient registration response:', response);

      if (response.success && response.data) {
        this.token = response.data.token;
        this.user = {
          id: response.data.patient.patient_id,
          name: response.data.patient.name,
          email: response.data.patient.email,
          phone: response.data.patient.phone,
          role: 'patient',
          age: response.data.patient.age,
          gender: response.data.patient.gender,
          address: response.data.patient.address,
        };

        // Store in localStorage
        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('user_data', JSON.stringify(this.user));
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.',
      };
    }
  }

  // Register doctor
  async registerDoctor(userData: DoctorRegistrationData): Promise<AuthResponse> {
    try {
      console.log('AuthService: Registering doctor with data:', userData);
      const response = await healthRecordsApi.registerDoctor(userData);
      console.log('AuthService: Doctor registration response:', response);

      if (response.success && response.data) {
        this.token = response.data.token;
        this.user = {
          id: response.data.doctor.doctor_id,
          name: response.data.doctor.name,
          email: response.data.doctor.email,
          phone: response.data.doctor.contact,
          role: 'doctor',
          specialization: response.data.doctor.specialization,
          hospital: response.data.doctor.hospital,
          license_number: response.data.doctor.license_number,
        };

        // Store in localStorage
        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('user_data', JSON.stringify(this.user));
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.',
      };
    }
  }

  // Register pharmacist
  async registerPharmacist(userData: PharmacistRegistrationData): Promise<AuthResponse> {
    try {
      console.log('AuthService: Registering pharmacist with data:', userData);
      const response = await healthRecordsApi.registerPharmacist(userData);
      console.log('AuthService: Pharmacist registration response:', response);

      if (response.success && response.data) {
        this.token = response.data.token;
        this.user = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone,
          role: 'pharmacist',
          pharmacy_name: response.data.user.pharmacy_name,
          pharmacy_id: response.data.user.pharmacy_id,
          address: response.data.user.address,
        };
        // Store in localStorage
        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('user_data', JSON.stringify(this.user));
        return { success: true, message: 'Pharmacist registered successfully' };
      } else {
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Pharmacist registration error:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.',
      };
    }
  }

  // Logout user
  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  // Get stored user from localStorage
  private getStoredUser(): User | null {
    try {
      const storedUser = localStorage.getItem('user_data');
      console.log('AuthService: Raw stored user data:', storedUser);
      const parsed = storedUser ? JSON.parse(storedUser) : null;
      console.log('AuthService: Parsed user data:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(updateData: Partial<User>): Promise<AuthResponse> {
    try {
      if (!this.token) {
        return {
          success: false,
          message: 'Not authenticated',
        };
      }

      const response = await healthRecordsApi.updateProfile(updateData);

      if (response.success && response.data) {
        this.user = { ...this.user, ...response.data.user };
        localStorage.setItem('user_data', JSON.stringify(this.user));
      }

      return response;
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: 'Profile update failed. Please try again.',
      };
    }
  }

  // Check if user has specific role
  hasRole(role: 'patient' | 'doctor' | 'pharmacist'): boolean {
    return this.user?.role === role;
  }

  // Check if user is patient
  isPatient(): boolean {
    return this.hasRole('patient');
  }

  // Check if user is doctor
  isDoctor(): boolean {
    return this.hasRole('doctor');
  }

  // Check if user is pharmacist
  isPharmacist(): boolean {
    return this.hasRole('pharmacist');
  }
}

// Create singleton instance
export const authService = new AuthService();
export default authService;
