import type {FastifyRequest, FastifyReply} from 'fastify';
import { UpdateVehicleModelService } from '../../services/servicesVehicleModel/UpdateVehicleModelService.js';

class UpdateVehicleModelController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const {name, manufacturer_id} = request.body as { name?: string; manufacturer_id?: number };

    const updateVehicleModelService = new UpdateVehicleModelService();
    try{
      const vehicleModel = await updateVehicleModelService.execute({ id: Number(id), name, manufacturer_id });
      reply.send(vehicleModel);
    }catch(error){
      reply.status(400).send({ error: (error as Error).message });
    }
  }
}

export { UpdateVehicleModelController };