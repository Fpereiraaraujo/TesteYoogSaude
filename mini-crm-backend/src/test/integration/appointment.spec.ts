import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../infrastructure/http/server';
import { prisma } from '../../infrastructure/database/prisma';

describe('Appointment Integration Tests', () => {
  let patientId: string;
  let appointmentId: string;


  beforeAll(async () => {
    await app.ready();
    await prisma.appointment.deleteMany();
    await prisma.patient.deleteMany();
  });


  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('should create a patient', async () => {
    const response = await request(app.server)
      .post('/patients')
      .send({
        name: 'Maria Oliveira',
        phone: '11999999999'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    patientId = response.body.id; 
  });

  it('should create an appointment for the patient', async () => {
    const response = await request(app.server)
      .post('/appointments')
      .send({
        patientId,
        description: 'Retorno de exames'
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('WAITING');
    appointmentId = response.body.id;
  });

  it('should list appointments with pagination', async () => {
    const response = await request(app.server)
      .get('/appointments?page=1&limit=5');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should transition appointment status to IN_PROGRESS', async () => {
    const response = await request(app.server)
      .patch(`/appointments/${appointmentId}/status`)
      .send({ status: 'IN_PROGRESS' });

    expect(response.status).toBe(204);
  });

 it('should NOT allow invalid status transition (IN_PROGRESS to WAITING)', async () => {
    const response = await request(app.server)
      .patch(`/appointments/${appointmentId}/status`)
      .send({ status: 'WAITING' });

    expect(response.status).toBe(400);
    // Aqui nós ajustamos para o texto correto:
    expect(response.body.message).toContain('Invalid status'); 
  });
});