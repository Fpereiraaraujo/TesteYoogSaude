export type AppointmentStatus = 'WAITING' | 'IN_PROGRESS' | 'FINISHED';

export interface Patient {
  id: string;
  name: string;
  phone: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  description: string;
  status: AppointmentStatus;
  createdAt: string;
}