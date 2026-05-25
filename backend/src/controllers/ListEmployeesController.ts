import type {FastifyRequest, FastifyReply} from 'fastify';
import { ListEmployeeService } from '../services/ListEmployeesService.js';

class ListEmployeeController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const listEmployeeService = new ListEmployeeService();

    const employees = await listEmployeeService.execute();

    return reply.status(200).send(employees);
  }
}

export { ListEmployeeController };