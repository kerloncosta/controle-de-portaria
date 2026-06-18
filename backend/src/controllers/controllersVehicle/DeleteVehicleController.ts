import type {FastifyRequest, FastifyReply} from 'fastify';
import { DeleteVehicleService } from '../../services/servicesVehicle/DeleteVehicleService.js';

class DeleteVehicleController {
  async handle(request: FastifyRequest, reply: FastifyReply){

    const { id } = request.params as { id: string };
    const vehicleService = new DeleteVehicleService();

    try {
      const vehicle = await vehicleService.execute({ id });
      return reply.send(vehicle);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  }
}

export { DeleteVehicleController };