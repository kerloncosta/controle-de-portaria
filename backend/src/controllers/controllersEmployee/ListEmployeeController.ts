import type {FastifyRequest, FastifyReply} from 'fastify';
import { ListEmployeeService } from '../../services/servicesEmployee/ListEmployeeService.js';

interface ListQueryRequest {
  page?: string;
  limit?: string;
  search?: string;
}

class ListEmployeeController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { page, limit, search} = request.query as ListQueryRequest;
    const listEmployeeService = new ListEmployeeService();

    const employees = await listEmployeeService.execute({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search ? String(search) : undefined
  });

    return reply.status(200).send(employees);
  }
}

export { ListEmployeeController };