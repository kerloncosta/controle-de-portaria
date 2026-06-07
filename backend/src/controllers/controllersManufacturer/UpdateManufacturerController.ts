import type {FastifyRequest, FastifyReply} from 'fastify';
import { UpdateManufacturerService } from '../../services/servicesManufacturer/UpdateManufacturerService.js';

class UpdateManufacturerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const { name } = request.body as { name: string };

  const updateManufacturerService = new UpdateManufacturerService();

    try{
      const manufacturer = await updateManufacturerService.execute(Number(id), name);
      reply.send(manufacturer);
    }catch(error){
      reply.status(400).send({ error: (error as Error).message });
    }
  }
}

export { UpdateManufacturerController };