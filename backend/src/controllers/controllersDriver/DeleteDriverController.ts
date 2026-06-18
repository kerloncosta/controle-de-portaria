import type {FastifyRequest, FastifyReply} from 'fastify';
import { DeleteDriverService } from '../../services/servicesDriver/DeleteDriverService.js';

class DeleteDriverController {
  async handle(request: FastifyRequest, reply: FastifyReply) {

    const { id } = request.params as { id: string };
    const driverService = new DeleteDriverService();

    try {
      const driver = await driverService.execute({ id });
      return reply.send(driver);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
}

export { DeleteDriverController };
