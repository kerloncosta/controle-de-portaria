import type {FastifyRequest, FastifyReply} from 'fastify';
import { DeleteMovementService } from '../../services/servicesMovement/DeleteMovementService.js';

class DeleteMovementController {
  async handle(request: FastifyRequest, reply: FastifyReply) {

    const { id } =request.params as { id: string};
    const movementService = new DeleteMovementService();

    const movement = await movementService.execute({ id });

    reply.send(movement);
  }
}

export { DeleteMovementController };