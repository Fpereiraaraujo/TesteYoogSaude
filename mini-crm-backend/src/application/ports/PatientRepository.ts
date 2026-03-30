import { Patient } from '../../domain/entities/Patient';

export interface PatientRepository {
  save(patient: Patient): Promise<void>;
  findById(id: string): Promise<Patient | null>;
}