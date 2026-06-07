import type {FastifyRequest, FastifyReply} from 'fastify';
import { ListVehicleModelService } from '../../services/servicesVehicleModel/ListVehicleModelService.js';

class ListVehicleModelController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const listVehicleModelService = new ListVehicleModelService();

    const vehicleModels = await listVehicleModelService.execute();

    return reply.status(200).send(vehicleModels);
  }
}

export { ListVehicleModelController };