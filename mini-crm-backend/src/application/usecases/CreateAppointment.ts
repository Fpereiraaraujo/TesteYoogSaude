import { Appointment, AppointmentStatus } from '../../domain/entities/Appointment';
import { AppointmentRepository } from '../ports/AppointmentRepository';
import { PatientRepository } from '../ports/PatientRepository';
import { randomUUID } from 'crypto';

export class CreateAppointment {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private patientRepository: PatientRepository
  ) {}

  async execute(patientId: string, description: string): Promise<Appointment> {
    const patient = await this.patientRepository.findById(patientId);
    
    if (!patient) {
      throw new Error('Patient not found');
    }

    const appointment = new Appointment(
      randomUUID(),
      patientId,
      description,
      AppointmentStatus.WAITING,
      new Date(),
      new Date()
    );

    await this.appointmentRepository.save(appointment);
    
    return appointment;
  }
}