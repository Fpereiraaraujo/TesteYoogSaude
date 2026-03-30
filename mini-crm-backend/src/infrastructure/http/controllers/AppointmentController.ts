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
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: "Dados de entrada inválidos",  });
      }
      return reply.status(400).send({ 
        message: error instanceof Error ? error.message : "Erro interno ao criar agendamento" 
      });
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
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
        updatedAt: app.updatedAt,
        patient: app.patient ? {
          id: app.patient.id,
          name: app.patient.name,
          phone: app.patient.phone
        } : null
      }));

      return reply.status(200).send(response);
    } catch (error) {
      return reply.status(500).send({ message: "Erro ao listar agendamentos" });
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
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: "Parâmetros inválidos", });
      }
      if (error instanceof InvalidStatusTransitionError || error instanceof Error) {
        return reply.status(400).send({ message: error.message });
      }
      return reply.status(500).send({ message: "Erro ao atualizar status" });
    }
  }
}