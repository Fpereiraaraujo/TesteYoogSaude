import { Patient } from '../../domain/entities/Patient';
import { PatientRepository } from '../ports/PatientRepository';
import { randomUUID } from 'crypto';

export class CreatePatient {
  constructor(private patientRepository: PatientRepository) {}

  async execute(name: string, phone: string): Promise<Patient> {
    const patient = new Patient(
      randomUUID(),
      name,
      phone,
      new Date(),
      new Date()
    );

    await this.patientRepository.save(patient);
    
    return patient;
  }
}