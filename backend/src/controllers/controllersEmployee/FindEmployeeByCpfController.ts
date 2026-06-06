import type {FastifyRequest, FastifyReply} from 'fastify';
import {FindEmployeeByCpfService} from '../../services/servicesEmployee/FindEmployeeByCpfService.js';

class FindEmployeeByCpfController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const {cpf} = request.params as {cpf: string};

    const findEmployeeByCpfService = new FindEmployeeByCpfService();
    
    try{
      const employee = await findEmployeeByCpfService.execute({cpf});
      return reply.status(200).send(employee); 

    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return reply.status(400).send({ error: message });

    }
  }
}

export { FindEmployeeByCpfController };