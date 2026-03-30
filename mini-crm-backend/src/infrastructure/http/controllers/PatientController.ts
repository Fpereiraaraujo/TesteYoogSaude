import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { PrismaPatientRepository } from '../../database/PrismaPatientRepository';
import { CreatePatient } from '../../../application/usecases/CreatePatient';

export class PatientController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const createBody = z.object({
      name: z.string().min(3),
      phone: z.string().min(8),
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
  }
}