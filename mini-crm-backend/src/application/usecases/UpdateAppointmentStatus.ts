import { AppointmentStatus } from '../../domain/entities/Appointment';
import { AppointmentRepository } from '../ports/AppointmentRepository';

export class UpdateAppointmentStatus {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(appointmentId: string, newStatus: AppointmentStatus): Promise<void> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (newStatus === AppointmentStatus.IN_PROGRESS) {
      appointment.startService();
    } else if (newStatus === AppointmentStatus.FINISHED) {
      appointment.finishService();
    } else {
      throw new Error('Invalid status for manual transition');
    }

    await this.appointmentRepository.update(appointment);
  }
}