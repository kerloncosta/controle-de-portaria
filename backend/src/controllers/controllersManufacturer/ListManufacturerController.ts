import type {FastifyRequest, FastifyReply} from 'fastify';
import { ListManufacturerService } from '../../services/servicesManufacturer/ListManufacturerService.js';

class ListManufacturerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const listManufacturerService = new ListManufacturerService();

    const manufacturers = await listManufacturerService.execute();
    
    reply.send(manufacturers);
  }
}

export { ListManufacturerController };