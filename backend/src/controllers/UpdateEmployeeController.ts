import type {FastifyRequest, FastifyReply} from 'fastify';
import { UpdateEmployeeService } from '../services/UpdateEmployeeService.js';

class UpdateEmployeeController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { cpf } = request.params as { cpf: string };
    const {name, password, role} = request.body as { name?: string; password?: string; role?: number };
  

const updateEmployeeService = new UpdateEmployeeService();

    try{
      const employee = await updateEmployeeService.execute({ cpf, name, password, role });
      reply.send(employee);
    }catch(error){
      reply.status(400).send({ error: (error as Error).message });
    }
  }
}

export { UpdateEmployeeController };