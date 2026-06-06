import type {FastifyRequest, FastifyReply} from 'fastify';
import { DeleteEmployeeService } from '../../services/servicesEmployee/DeleteEmployeeService.js';

class DeleteEmployeeController {
  async handle(request: FastifyRequest, reply: FastifyReply) {

    const { id } = request.params as { id: string };
    const employeeService = new DeleteEmployeeService();

    const employee = await employeeService.execute({ id });

    reply.send(employee);
  }
}


export { DeleteEmployeeController };
  