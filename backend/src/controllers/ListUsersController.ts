import type {FastifyRequest, FastifyReply} from 'fastify';
import { ListUsersService } from '../services/ListUsersService.js';

class ListUsersController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const listUsersService = new ListUsersService();

    const users = await listUsersService.execute();

    return reply.status(200).send(users);
  }
}

export { ListUsersController };