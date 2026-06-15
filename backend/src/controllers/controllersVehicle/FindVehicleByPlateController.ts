import type {FastifyRequest, FastifyReply} from 'fastify';
import { FindVehicleByPlateService } from '../../services/servicesVehicle/FindVehicleByPlateService.js';
import { validatePlateFormat } from '../../utils/validators.js';

class FindVehicleByPlateController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const {plate} = request.params as { plate: string};

    if (!validatePlateFormat(plate)) {
      return reply.status(400).send({ error: "O formato da placa para busca é inválido." });
    }

    const findVehicleByPlateService = new FindVehicleByPlateService();

    try{
      const vehicle = await findVehicleByPlateService.execute({plate});
      return reply.status(200).send(vehicle);

    } catch(err) {
      const message = err instanceof Error ? err.message : String(err);
      return reply.status(400).send({ error: message });
      
    }
  }
}

export { FindVehicleByPlateController }