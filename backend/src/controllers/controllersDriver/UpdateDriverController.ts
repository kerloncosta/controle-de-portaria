import type {FastifyRequest, FastifyReply} from 'fastify';
import { UpdateDriverService } from '../../services/servicesDriver/UpdateDriverService.js';
import { validateCpfFormat, validateCnhFormat } from '../../utils/validators.js';

class UpdateDriverController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const {name, cpf, cnh, cnh_expiration} = request.body as { name?: string; cpf?: string; cnh?: string; cnh_expiration?: string };

    if (cpf && !validateCpfFormat(cpf)) {
      return reply.status(400).send({ error: "O CPF deve conter exatamente 11 números e deve ser válido." });
    }

    if (cnh && !validateCnhFormat(cnh)) {
      return reply.status(400).send({ error: "Para atualizar um motorista precisa informar uma CNH válida." });
    }

    if (cnh_expiration) {
      const expirationDate = new Date(cnh_expiration);
      const today = new Date();

      today.setHours(0, 0, 0, 0);
      expirationDate.setHours(0, 0, 0, 0);

      if (expirationDate < today) {
        return reply.status(400).send({ error: "Não é possível atualizar para uma CNH vencida." });
      }
    }

    const updateDriverService = new UpdateDriverService();

    try{
      const driver = await updateDriverService.execute({ id, cpf, name, cnh, cnh_expiration });
      reply.send(driver);
    }catch(error){
      reply.status(400).send({ error: (error as Error).message });
    }
  }
}

export { UpdateDriverController };
