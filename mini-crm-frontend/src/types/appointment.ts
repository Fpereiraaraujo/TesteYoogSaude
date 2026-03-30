export interface AppointmentFormData {
  name: string;
  phone: string;
  description: string;
}

export type AppointmentStatus = "waiting" | "in_progress" | "completed";

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  description: string;
  status: AppointmentStatus;
  createdAt: string;
}