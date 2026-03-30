
import { AppointmentRepository } from '../../application/ports/AppointmentRepository';
import { Appointment } from '../../domain/entities/Appointment';


export class InMemoryAppointmentRepository implements AppointmentRepository {
  public items: Appointment[] = [];

  async save(appointment: Appointment): Promise<void> {
    this.items.push(appointment);
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment = this.items.find((item) => item.id === id);
    return appointment || null;
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Appointment[]> {
    const start = (page - 1) * limit;
    const end = start + limit;
    return this.items.slice(start, end);
  }

  async update(appointment: Appointment): Promise<void> {
    const index = this.items.findIndex((item) => item.id === appointment.id);
    if (index !== -1) {
      this.items[index] = appointment;
    }
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id);
  }
}