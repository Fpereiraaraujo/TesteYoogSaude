import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { PrismaPatientRepository } from '../../database/PrismaPatientRepository';
import { CreatePatient } from '../../../application/usecases/CreatePatient';

export class PatientController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const createBody = z.object({
        name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
        phone: z.string().min(8, "O telefone deve ter pelo menos 8 dígitos"),
      });

      const { name, phone } = createBody.parse(request.body);

      const repository = new PrismaPatientRepository();
      const useCase = new CreatePatient(repository);
      
      const patient = await useCase.execute(name, phone);
      
      return reply.status(201).send({
        id: patient.id,
        name: patient.name,
        phone: patient.phone,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: "Dados de validação incorretos",
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      return reply.status(400).send({
        message: error instanceof Error ? error.message : "Erro inesperado ao processar paciente"
      });
    }
  }
}