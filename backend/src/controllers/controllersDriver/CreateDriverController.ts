import type {FastifyRequest, FastifyReply} from 'fastify';
import {CreateDriverService} from '../../services/servicesDriver/CreateDriverService.js';
import {validateCpfFormat, validateCnhFormat} from '../../utils/validators.js';

class CreateDriverController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, cpf, cnh, cnh_expiration } = request.body as { name: string; cpf: string; cnh: string, cnh_expiration: string };

    if (!validateCpfFormat(cpf)) {
      return reply.status(400).send({ error: "O CPF deve conter exatamente 11 números e deve ser válido." });
    }

    if (!validateCnhFormat(cnh)) {
      return reply.status(400).send({ error: "A CNH deve conter exatamente 11 números e deve ser válida." });
    }

    const expirationDate = new Date(cnh_expiration);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    expirationDate.setHours(0, 0, 0, 0);

    if (expirationDate < today) {
      return reply.status(400).send({ error: "Não é possível cadastrar um motorista com a CNH vencida." });
    }

    const service = new CreateDriverService();
    try{
      const driver = await service.execute({ name, cpf, cnh, cnh_expiration });
      return reply.status(201).send(driver);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  }
}

export { CreateDriverController };