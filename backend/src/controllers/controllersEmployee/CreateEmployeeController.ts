import type {FastifyRequest, FastifyReply} from 'fastify';
import {CreateEmployeeService} from '../../services/servicesEmployee/CreateEmployeeService.js';
import {validateCpfFormat, validateRole, validatePassword} from '../../utils/validators.js';

class CreateEmployeeController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, cpf, password, role } = request.body as { name: string; cpf: string; password: string; role: number };

    if (!validateCpfFormat(cpf)) {
      return reply.status(400).send({ error: "O CPF deve conter exatamente 11 números e deve ser válido." });
    }

    if (!validatePassword(password)) {
      return reply.status(400).send({ error: "A senha deve ter no mínimo 6 caracteres, 1 número e 1 letra maiúscula." });
    }

    if (!validateRole(role)) {
      return reply.status(400).send({ error: "Permissão inválida. Escolha Operador ou Administrador." });
    }

    const service = new CreateEmployeeService();
    try{
      const employee = await service.execute({ name, cpf, password, role});
      return reply.status(201).send(employee);

    }catch(error){
      return reply.status(400).send({ error: (error as Error).message });
    } 
  }
}

export { CreateEmployeeController };