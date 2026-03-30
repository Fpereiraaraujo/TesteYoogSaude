import { Appointment } from '../../domain/entities/Appointment';

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>;
  findById(id: string): Promise<Appointment | null>;
  findAll(page: number, limit: number): Promise<Appointment[]>;
  update(appointment: Appointment): Promise<void>;
  delete(id: string): Promise<void>;
}