import type {FastifyRequest, FastifyReply} from 'fastify';
import { ListDriverService } from '../../services/servicesDriver/ListDriverService.js';

class ListDriverController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const listDriverService = new ListDriverService();

    const drivers = await listDriverService.execute();

    return reply.status(200).send(drivers);
  }
}

export { ListDriverController };