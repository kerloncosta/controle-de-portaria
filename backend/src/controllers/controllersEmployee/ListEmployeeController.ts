import type {FastifyRequest, FastifyReply} from 'fastify';
import { ListEmployeeService } from '../../services/servicesEmployee/ListEmployeeService.js';

class ListEmployeeController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const listEmployeeService = new ListEmployeeService();

    const employees = await listEmployeeService.execute();

    return reply.status(200).send(employees);
  }
}

export { ListEmployeeController };