import { authService } from './authService';

export interface AppointmentDoctor {
  doctor_id: string;
  name: string;
  specialization?: string;
  hospital?: string;
}

export interface Appointment {
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  patient?: { patient_id: string; name: string; email: string } | null;
  doctor?: { doctor_id: string; name: string; specialization?: string } | null;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api/appointments${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authService.getToken()}`,
      ...(options.headers || {})
    }
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || 'Appointment request failed');
  }
  return payload.data as T;
}

export const appointmentsApi = {
  listDoctors: () => request<AppointmentDoctor[]>('/doctors'),
  list: () => request<Appointment[]>('/'),
  get: (appointmentId: string) => request<Appointment>(`/${appointmentId}`),
  create: (data: { doctor_id: string; appointment_date: string; appointment_time: string; reason: string }) =>
    request<Appointment>('/', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (appointmentId: string, status: Appointment['status'], notes?: string) =>
    request<Appointment>(`/${appointmentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes })
    })
};
