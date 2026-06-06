import type {FastifyRequest, FastifyReply} from 'fastify';
import { CreateManufacturesService } from '../../services/servicesManufacturer/CreateManufactureService.js';

class CreateManufacturerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {

    const { name } = request.body as { name: string };

    try {

      const manufacturerService = new CreateManufacturesService();
      const manufacturer = await manufacturerService.execute(name);

      return reply.status(201).send(manufacturer);

    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  }
}

export { CreateManufacturerController };