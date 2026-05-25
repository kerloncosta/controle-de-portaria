import type {FastifyRequest, FastifyReply} from 'fastify';
import { DeleteUserService } from '../services/DeleteUserService.js';

class DeleteUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {

    const { cpf } = request.query as { cpf: string };
    const userService = new DeleteUserService();

    const user = await userService.execute({ cpf});

    reply.send(user);
  }
}


export { DeleteUserController };
  