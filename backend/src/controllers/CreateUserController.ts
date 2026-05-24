import type {FastifyRequest, FastifyReply} from 'fastify';
import { CreateUserService } from '../services/CreateUserService.js';

class CreateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, cpf, password, role } = request.body as { name: string; cpf: string; password: string; role: number };

    const service = new CreateUserService();

    const user = await service.execute({ name, cpf, password, role});

    return reply.status(201).send(user);
  }
}

export { CreateUserController };