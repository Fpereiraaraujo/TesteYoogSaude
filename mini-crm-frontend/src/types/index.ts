export type AppointmentStatus = 'WAITING' | 'IN_PROGRESS' | 'FINISHED';

export interface Patient {
  id: string;
  name: string;
  phone: string;
}
export interface Appointment {
  id: string;
  description: string;
  status: 'WAITING' | 'IN_PROGRESS' | 'FINISHED';
  patient: {
    name: string;
    phone: string;
  };
}