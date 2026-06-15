import type {FastifyRequest, FastifyReply} from 'fastify';
import { CreateVehicleService } from '../../services/servicesVehicle/CreateVehicleService.js';
import { validatePlateFormat } from '../../utils/validators.js';

class CreateVehicleController {
  async handle(request: FastifyRequest, reply: FastifyReply){
    const { plate, color, model_id, driver_id } = request.body as {plate: string,  color: string, model_id: number, driver_id: string}

    if(!plate || !validatePlateFormat(plate)){
      return reply.status(400).send({ error: "A placa informada é inválida. Use o formato ABC-1234 ou ABC1D23." });
    }

    const service = new CreateVehicleService();

    try{
      const vehicle = await service.execute({
        plate,
        color,
        model_id,
        driver_id,
      });

      return reply.status(201).send(vehicle);

    }catch (error){
      return reply.status(400).send({ error: (error as Error).message });
    }
  }
}

export { CreateVehicleController }