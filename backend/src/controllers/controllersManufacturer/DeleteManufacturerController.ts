import type {FastifyRequest, FastifyReply} from 'fastify';
import { DeleteManufacturerService } from '../../services/servicesManufacturer/DeleteManufactureService.js';

class DeleteManufacturerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {

    const { id } = request.params as { id: string };
    const manufacturerService = new DeleteManufacturerService();

    const manufacturer = await manufacturerService.execute(Number(id));

    reply.send(manufacturer);
  }
}

export { DeleteManufacturerController };