import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { PrismaAppointmentRepository } from '../../database/PrismaAppointmentRepository';
import { PrismaPatientRepository } from '../../database/PrismaPatientRepository';
import { CreateAppointment } from '../../../application/usecases/CreateAppointment';
import { UpdateAppointmentStatus } from '../../../application/usecases/UpdateAppointmentStatus';
import { AppointmentStatus } from '../../../domain/entities/Appointment';

export class AppointmentController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const createBody = z.object({
        patientId: z.string().uuid(),
        description: z.string().min(5),
      });

      const { patientId, description } = createBody.parse(request.body);
      const appointmentRepo = new PrismaAppointmentRepository();
      const patientRepo = new PrismaPatientRepository();
      const useCase = new CreateAppointment(appointmentRepo, patientRepo);
      
      const appointment = await useCase.execute(patientId, description);
      
      return reply.status(201).send({
        id: appointment.id,
        patientId: appointment.patientId,
        description: appointment.description,
        status: appointment.status,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
        patient: appointment.patient ? {
          id: appointment.patient.id,
          name: appointment.patient.name,
          phone: appointment.patient.phone
        } : null
      });
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const listQuery = z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(50).default(10),
        search: z.string().optional(),
        status: z.string().optional(),
      });

      const { page, limit, search, status } = listQuery.parse(request.query);
      const repository = new PrismaAppointmentRepository();
      
      // SENIOR TIP: Se o status for 'all', passamos undefined para o repositório 
      // ignorar o filtro de status e trazer todos.
      const sanitizedStatus = status === 'all' ? undefined : status;
      
      const appointments = await repository.findAll(page, limit, search, sanitizedStatus);
      
      const response = appointments.map(app => ({
        id: app.id,
        patientId: app.patientId,
        description: app.description,
        status: app.status,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        patient: app.patient ? {
          id: app.patient.id,
          name: app.patient.name,
          phone: app.patient.phone
        } : null
      }));

      return reply.status(200).send(response);
    } catch (error: any) {
      return reply.status(400).send({ message: "Erro ao listar agendamentos" });
    }
  }

  async updateStatus(request: FastifyRequest, reply: FastifyReply) {
    const updateParams = z.object({ id: z.string().uuid() });
    const updateBody = z.object({ status: z.nativeEnum(AppointmentStatus) });

    try {
      const { id } = updateParams.parse(request.params);
      const { status } = updateBody.parse(request.body);
      
      const repository = new PrismaAppointmentRepository();
      const useCase = new UpdateAppointmentStatus(repository);
      
      await useCase.execute(id, status);
      return reply.status(204).send();
    } catch (error: any) {
      return reply.status(400).send({ message: error.message });
    }
  }


async delete(request: FastifyRequest, reply: FastifyReply) {
  const deleteParams = z.object({ id: z.string().uuid() });

  try {
    const { id } = deleteParams.parse(request.params);
    const repository = new PrismaAppointmentRepository();
    
    // Verificamos se existe antes de deletar
    const appointment = await repository.findById(id);
    if (!appointment) {
      return reply.status(404).send({ message: "Agendamento não encontrado" });
    }

    await repository.delete(id);
    return reply.status(204).send();
  } catch (error: any) {
    return reply.status(400).send({ message: error.message });
  }
}
}