import type {FastifyRequest, FastifyReply} from 'fastify';
import { DeleteDriverService } from '../../services/servicesDriver/DeleteDriverService.js';

class DeleteDriverController {
  async handle(request: FastifyRequest, reply: FastifyReply) {

    const { id } = request.params as { id: string };
    const driverService = new DeleteDriverService();

    const driver = await driverService.execute({ id });

    reply.send(driver);
  }
}

export { DeleteDriverController };
