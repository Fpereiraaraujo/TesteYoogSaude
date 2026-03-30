import { FastifyInstance } from 'fastify';
import { PatientController } from './controllers/PatientController';
import { AppointmentController } from './controllers/AppointmentController';

export async function appRoutes(app: FastifyInstance) {
  const patientController = new PatientController();
  const appointmentController = new AppointmentController();

  app.post('/patients', patientController.create);
  
  app.post('/appointments', appointmentController.create);
  app.get('/appointments', appointmentController.list);
  app.patch('/appointments/:id/status', appointmentController.updateStatus);
}