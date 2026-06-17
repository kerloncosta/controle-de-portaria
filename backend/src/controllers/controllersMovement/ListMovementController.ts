import type {FastifyRequest, FastifyReply} from 'fastify';
import { ListMovementService } from '../../services/servicesMovement/ListMovementService.js';

class ListMovementController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const listMovementService = new ListMovementService();

    const movements = await listMovementService.execute();

    return reply.status(200).send(movements);
  }
}

export { ListMovementController };