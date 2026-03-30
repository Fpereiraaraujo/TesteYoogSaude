import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateAppointmentStatus } from './UpdateAppointmentStatus';
import { Appointment, AppointmentStatus } from '../../domain/entities/Appointment';
import { InvalidStatusTransitionError } from '../../domain/exceptions/InvalidStatusTransitionError';
import { InMemoryAppointmentRepository } from '../../test/repositories/InMemoryAppointmentRepository';

describe('UpdateAppointmentStatus Use Case', () => {
  let appointmentRepository: InMemoryAppointmentRepository;
  let sut: UpdateAppointmentStatus; 


  beforeEach(() => {
    appointmentRepository = new InMemoryAppointmentRepository();
    sut = new UpdateAppointmentStatus(appointmentRepository);
  });

  it('should be able to start an appointment', async () => {
   
    const appointment = new Appointment(
      'fake-id',
      'patient-id',
      'Consulta teste',
      AppointmentStatus.WAITING,
      new Date(),
      new Date()
    );
    await appointmentRepository.save(appointment);

   
    await sut.execute('fake-id', AppointmentStatus.IN_PROGRESS);

  
    expect(appointmentRepository.items[0].status).toBe(AppointmentStatus.IN_PROGRESS);
  });

  it('should not be able to finish a waiting appointment', async () => {
    // 1. Arrange
    const appointment = new Appointment(
      'fake-id',
      'patient-id',
      'Consulta teste',
      AppointmentStatus.WAITING,
      new Date(),
      new Date()
    );
    await appointmentRepository.save(appointment);

    await expect(() => 
      sut.execute('fake-id', AppointmentStatus.FINISHED)
    ).rejects.toBeInstanceOf(InvalidStatusTransitionError);
  });

  it('should not be able to update a non-existing appointment', async () => {
    await expect(() => 
      sut.execute('invalid-id', AppointmentStatus.IN_PROGRESS)
    ).rejects.toThrow('Appointment not found');
  });
});