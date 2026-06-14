import type {FastifyRequest, FastifyReply} from 'fastify';
import { FindDriverByCpfService } from '../../services/servicesDriver/FindDriverByCpfService.js';

class FindDriverByCpfController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { cpf } = request.params as { cpf: string };

    const findDriverByCpfService = new FindDriverByCpfService();

    try {
      const driver = await findDriverByCpfService.execute({ cpf });
      return reply.status(200).send(driver);

    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return reply.status(400).send({ error: message });

    }
  }
}

export { FindDriverByCpfController };