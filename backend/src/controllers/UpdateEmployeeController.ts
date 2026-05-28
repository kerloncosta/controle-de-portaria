import type {FastifyRequest, FastifyReply} from 'fastify';
import { UpdateEmployeeService } from '../services/UpdateEmployeeService.js';
import { validateCpfFormat, validatePassword, validateRole } from '../utils/validators.js';

class UpdateEmployeeController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const {name, cpf, password, role} = request.body as { name?: string; cpf?: string; password?: string; role?: number };
  

    if (cpf && !validateCpfFormat(cpf)) {
      return reply.status(400).send({ error: "O CPF deve conter exatamente 11 números e deve ser válido." });
    }

    if (password && !validatePassword(password)) {
      return reply.status(400).send({ error: "A senha deve ter no mínimo 6 caracteres, 1 número e 1 letra maiúscula." });
    }

    if (role !== undefined && !validateRole(role)) {
      return reply.status(400).send({ error: "Permissão inválida. Escolha Operador ou Administrador." });
    }

const updateEmployeeService = new UpdateEmployeeService();

    try{
      const employee = await updateEmployeeService.execute({ id, cpf, name, password, role });
      reply.send(employee);
    }catch(error){
      reply.status(400).send({ error: (error as Error).message });
    }
  }
}

export { UpdateEmployeeController };