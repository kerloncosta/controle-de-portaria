import type {FastifyRequest, FastifyReply} from 'fastify';
import { FindDriverByCnhService } from '../../services/servicesDriver/FindDriverByCnhService.js';

class FindDriverByCnhController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { cnh } = request.params as { cnh: string };

    const findDriverByCnhService = new FindDriverByCnhService();

    try {
      const driver = await findDriverByCnhService.execute({ cnh });
      return reply.status(200).send(driver);

    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return reply.status(400).send({ error: message });
      
    }
  }
}

export { FindDriverByCnhController };