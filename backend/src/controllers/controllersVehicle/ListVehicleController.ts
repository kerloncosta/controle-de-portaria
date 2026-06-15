import type {FastifyRequest, FastifyReply} from 'fastify';
import { ListVehicleService } from '../../services/servicesVehicle/ListVehicleService.js';

class ListVehicleController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const listVehicleService = new ListVehicleService();

    const vehicles = await listVehicleService.execute();

    return reply.status(200).send(vehicles);
  }
}

export { ListVehicleController };