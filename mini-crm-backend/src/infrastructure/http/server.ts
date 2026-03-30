import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { ZodError } from 'zod';
import { appRoutes } from './routes';

export const app = Fastify({ logger: false });


app.register(cors, {
  origin: '*', 
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
});


app.register(swagger, {
  openapi: {
    info: {
      title: 'Mini CRM API',
      description: 'API de gerenciamento de pacientes e atendimentos construída com Arquitetura Hexagonal.',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Servidor de Desenvolvimento'
      }
    ]
  }
});


app.register(swaggerUi, {
  routePrefix: '/docs', 
});


app.register(appRoutes);


app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: 'Validation error.', issues: error.format() });
  }

  console.error(error);
  return reply.status(500).send({ message: 'Internal server error.' });
});

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log('http server running on http://localhost:3333');
    console.log('swagger documentation available at http://localhost:3333/docs');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();