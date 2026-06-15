import type {FastifyRequest, FastifyReply} from 'fastify';
import { UpdateVehicleService } from '../../services/servicesVehicle/UpdateVehicleService.js';
import { validatePlateFormat } from '../../utils/validators.js';

class UpdateVehicleController {
  async handle(request: FastifyRequest, reply: FastifyReply){
    const { id } = request.params as { id: string};
    const { plate, color, model_id, driver_id } = request.body as {plate?: string,  color?: string, model_id?: number, driver_id?: string}

    if (plate && !validatePlateFormat(plate)) {
      return reply.status(400).send({ error: "A placa informada é inválida. Use o formato ABC-1234 ou ABC1D23." });
    }

    const updateVehicleService = new UpdateVehicleService();

    try{
      const vehicle = await updateVehicleService.execute({ id, plate, color, model_id, driver_id});
      reply.send(vehicle);
    }catch(error){
      reply.status(400).send({ error: (error as Error).message });
    }
  }
}

export { UpdateVehicleController };