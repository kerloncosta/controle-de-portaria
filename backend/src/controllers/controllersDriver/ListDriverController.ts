import type {FastifyRequest, FastifyReply} from 'fastify';
import { ListDriverService } from '../../services/servicesDriver/ListDriverService.js';

interface ListQueryRequest {
  page?: string;
  limit?: string;
  search?: string;
}

class ListDriverController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { page, limit, search} = request.query as ListQueryRequest;
    const listDriverService = new ListDriverService();

    const drivers = await listDriverService.execute({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search ? String(search) : undefined
    });

    return reply.status(200).send(drivers);
  }
}

export { ListDriverController };