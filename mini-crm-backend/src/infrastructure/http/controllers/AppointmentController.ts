import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { PrismaAppointmentRepository } from '../../database/PrismaAppointmentRepository';
import { PrismaPatientRepository } from '../../database/PrismaPatientRepository';
import { CreateAppointment } from '../../../application/usecases/CreateAppointment';
import { UpdateAppointmentStatus } from '../../../application/usecases/UpdateAppointmentStatus';
import { AppointmentStatus } from '../../../domain/entities/Appointment';
import { InvalidStatusTransitionError } from '../../../domain/exceptions/InvalidStatusTransitionError';

export class AppointmentController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const createBody = z.object({
      patientId: z.string().uuid(),
      description: z.string().min(5),
    });

    const { patientId, description } = createBody.parse(request.body);

    const appointmentRepo = new PrismaAppointmentRepository();
    const patientRepo = new PrismaPatientRepository();
    const useCase = new CreateAppointment(appointmentRepo, patientRepo);
    
    const appointment = await useCase.execute(patientId, description);
    
    // Transformamos a entidade num objeto limpo (Presenter/DTO)
    return reply.status(201).send({
      id: appointment.id,
      patientId: appointment.patientId,
      description: appointment.description,
      status: appointment.status, // Aqui o Getter é lido corretamente!
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    });
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const listQuery = z.object({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(50).default(10),
    });

    const { page, limit } = listQuery.parse(request.query);
    const repository = new PrismaAppointmentRepository();
    
    const appointments = await repository.findAll(page, limit);
    
    const response = appointments.map(app => ({
      id: app.id,
      patientId: app.patientId,
      description: app.description,
      status: app.status,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt
    }));

    return reply.status(200).send(response);
  }

  async updateStatus(request: FastifyRequest, reply: FastifyReply) {
    const updateParams = z.object({ id: z.string().uuid() });
    const updateBody = z.object({ status: z.nativeEnum(AppointmentStatus) });

    const { id } = updateParams.parse(request.params);
    const { status } = updateBody.parse(request.body);

    try {
      const repository = new PrismaAppointmentRepository();
      const useCase = new UpdateAppointmentStatus(repository);
      
      await useCase.execute(id, status);
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof InvalidStatusTransitionError || error instanceof Error) {
        return reply.status(400).send({ message: error.message });
      }
      throw error;
    }
  }
}