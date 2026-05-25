import Fastify from 'fastify';
import cors from '@fastify/cors';
import { routes } from './routes.js';

const server = Fastify({
  logger: true,
});

server.setErrorHandler((error: Error, request, reply) => {
  reply.status(400).send({ error: error.message });
});

const start = async () => {

  await server.register(cors);
  await server.register(routes);

    try{
      await server.listen({ port: 3333}); //, host: '0.0.0.0' colocar isso do para abrir para acesso a rede
    }catch(err){
      process.exit(1);
    }
  }

  start();