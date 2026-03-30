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
      include: { patient: true }
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

  async findAll(page: number = 1, limit: number = 10, search?: string, status?: string): Promise<Appointment[]> {
    const skip = (page - 1) * limit;
    
    // Proteção Sênior: Se o status for "all", vazio ou undefined, não aplicamos o filtro
    const isStatusValid = status && status !== 'all' && status !== '';

    const data = await prisma.appointment.findMany({
      skip,
      take: limit,
      where: {
        // Aplica o filtro de status apenas se for um valor válido
        ...(isStatusValid && { status: status as any }),
        
        // Filtro de Busca: Procura na descrição OU no nome do paciente
        ...(search && {
          OR: [
            { description: { contains: search, mode: 'insensitive' } },
            { patient: { name: { contains: search, mode: 'insensitive' } } }
          ]
        }),
      },
      orderBy: { createdAt: 'desc' },
      include: { patient: true }
    });
    
    return data.map(
      (item) => new Appointment(
          item.id, 
          item.patientId, 
          item.description, 
          item.status as AppointmentStatus, 
          item.createdAt, 
          item.updatedAt,
          item.patient // Mapeia o paciente para a entidade de domínio
        )
    );
  }

  async update(appointment: Appointment): Promise<void> {
    // ESSA PARTE É VITAL PARA AS AÇÕES (ATENDER/FINALIZAR) FUNCIONAREM
    await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        description: appointment.description,
        status: appointment.status, // Atualiza o status vindo da entidade
        updatedAt: appointment.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.appointment.delete({ where: { id } });
  }
}