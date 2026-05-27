import Fastify from 'fastify';
import cors from '@fastify/cors';
import { routes } from './routes.js';

const server = Fastify({
  logger: true,
});

const start = async () => {

  await server.register(cors, {
    origin: '*',
  });

  await server.register(routes);

  server.setErrorHandler((error: Error, request, reply) => {
    reply.status(400).send({ error: error.message });
  });

  try {
    await server.listen({
      port: 3333,
      host: '0.0.0.0',
    });

    console.log('Servidor rodando');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();