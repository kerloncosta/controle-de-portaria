import type {FastifyRequest, FastifyReply} from 'fastify';
import { CreateUserService } from '../services/CreateUserService.js';

class CreateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    
    const service = new CreateUserService();

    const user = await service.execute();

    return reply.status(201).send(user);
  }
}

export { CreateUserController };