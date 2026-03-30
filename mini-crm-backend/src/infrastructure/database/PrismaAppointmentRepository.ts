import { AppointmentRepository } from '../../application/ports/AppointmentRepository';
import { Appointment, AppointmentStatus } from '../../domain/entities/Appointment';
import { prisma } from './prisma';

export class PrismaAppointmentRepository implements AppointmentRepository {
  async save(appointment: Appointment): Promise<void> {
    await prisma.appointment.create({
      data: {
        id: appointment.id,
        patientId: appointment.patientId,
        description: appointment.description,
        status: appointment.status,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Appointment | null> {
    const data = await prisma.appointment.findUnique({ 
      where: { id },
      include: { patient: true } // Garante o carregamento do paciente
    });
    
    if (!data) return null;

    return new Appointment(
      data.id,
      data.patientId,
      data.description,
      data.status as AppointmentStatus,
      data.createdAt,
      data.updatedAt,
      data.patient 
    );
  }

  // PrismaAppointmentRepository.ts
async findAll(page: number, limit: number): Promise<Appointment[]> {
  const data = await prisma.appointment.findMany({
    skip: (page - 1) * limit,
    take: limit,
    include: { patient: true }, 
    orderBy: { createdAt: 'desc' }
  });

  return data.map(item => new Appointment(
    item.id,
    item.patientId,
    item.description,
    item.status as AppointmentStatus,
    item.createdAt,
    item.updatedAt,
    item.patient 
  ));
}

  async update(appointment: Appointment): Promise<void> {
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        description: appointment.description,
        status: appointment.status,
        updatedAt: appointment.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.appointment.delete({ where: { id } });
  }
}