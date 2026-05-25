import type {FastifyRequest, FastifyReply} from 'fastify';
import { DeleteEmployeeService } from '../services/DeleteEmployeeService.js';

class DeleteEmployeeController {
  async handle(request: FastifyRequest, reply: FastifyReply) {

    const { cpf } = request.query as { cpf: string };
    const employeeService = new DeleteEmployeeService();

    const employee = await employeeService.execute({ cpf});

    reply.send(employee);
  }
}


export { DeleteEmployeeController };
  