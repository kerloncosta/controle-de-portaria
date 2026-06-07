import type { FastifyRequest, FastifyReply } from 'fastify';
import { CreateVehicleModelService } from '../../services/servicesVehicleModel/CreateVehicleModelService.js';


class CreateVehicleModelController {
  async handle(request: FastifyRequest, reply: FastifyReply){
  const { name, manufacturer_id } = request.body as { name: string; manufacturer_id: number };

  if (!name || name.trim() === '' || !manufacturer_id) {
      return reply.status(400).send({ error: "Todos os campos são obrigatórios." });
    }

    const createVehicleModelService = new   CreateVehicleModelService();

    try {
      const vehicleModel = await createVehicleModelService.execute({ name, manufacturer_id });
      return reply.status(201).send(vehicleModel);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  }
}
export { CreateVehicleModelController };