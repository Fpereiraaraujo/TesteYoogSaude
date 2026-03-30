import { PatientRepository } from '../../application/ports/PatientRepository';
import { Patient } from '../../domain/entities/Patient';
import { prisma } from './prisma';

export class PrismaPatientRepository implements PatientRepository {
  async save(patient: Patient): Promise<void> {
    await prisma.patient.upsert({
      where: { id: patient.id },
      update: {
        name: patient.name,
        phone: patient.phone,
        updatedAt: patient.updatedAt,
      },
      create: {
        id: patient.id,
        name: patient.name,
        phone: patient.phone,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Patient | null> {
    const data = await prisma.patient.findUnique({ where: { id } });
    
    if (!data) return null;

    return new Patient(
      data.id,
      data.name,
      data.phone,
      data.createdAt,
      data.updatedAt
    );
  }

  async findByPhone(phone: string): Promise<Patient | null> {
    const data = await prisma.patient.findFirst({ where: { phone } });
    
    if (!data) return null;

    return new Patient(
      data.id,
      data.name,
      data.phone,
      data.createdAt,
      data.updatedAt
    );
  }
}