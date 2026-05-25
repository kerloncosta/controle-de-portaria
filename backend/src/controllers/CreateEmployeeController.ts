import type {FastifyRequest, FastifyReply} from 'fastify';
import {CreateEmployeeService} from '../services/CreateEmployeeService.js';

class CreateEmployeeController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, cpf, password, role } = request.body as { name: string; cpf: string; password: string; role: number };

    const service = new CreateEmployeeService();

    const employee = await service.execute({ name, cpf, password, role});

    return reply.status(201).send(employee);
  }
}

export { CreateEmployeeController };