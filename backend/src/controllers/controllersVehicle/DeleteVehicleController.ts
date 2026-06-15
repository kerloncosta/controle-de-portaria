import type {FastifyRequest, FastifyReply} from 'fastify';
import { DeleteVehicleService } from '../../services/servicesVehicle/DeleteVehicleService.js';

class DeleteVehicleController {
  async handle(request: FastifyRequest, reply: FastifyReply){

    const { id } = request.params as { id: string };
    const vehicleService = new DeleteVehicleService();

    const vehicle = await vehicleService.execute({ id });

    reply.send(vehicle);
  }
}

export { DeleteVehicleController };