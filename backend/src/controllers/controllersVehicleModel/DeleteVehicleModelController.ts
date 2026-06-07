import type {FastifyRequest, FastifyReply} from 'fastify';
import { DeleteVehicleModelService } from '../../services/servicesVehicleModel/DeleteVehicleModelService.js';

class DeleteVehicleModelController {
  async handle(request: FastifyRequest, reply: FastifyReply) {

    const { id } = request.params as { id: string };
    const vehicleModelService = new DeleteVehicleModelService();

    const vehicleModel = await vehicleModelService.execute(Number(id));

    reply.send(vehicleModel);
  }
}

export { DeleteVehicleModelController };