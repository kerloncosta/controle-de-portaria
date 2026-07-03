import type {FastifyRequest, FastifyReply} from 'fastify';
import { AuthService } from '../../services/servicesAuth/AuthService.js';
import { validateCpfFormat, validatePassword } from '../../utils/validators.js';

class AuthController {
  async handleLogin(request: FastifyRequest, reply: FastifyReply) {
    const { cpf, password } = request.body as { cpf: string; password: string };
    const authService = new AuthService();

    if (!validateCpfFormat(cpf)) {
          return reply.status(400).send({ error: "O CPF deve conter exatamente 11 números e deve ser válido." });
        }
    
        if (!validatePassword(password)) {
          return reply.status(400).send({ error: "A senha deve ter no mínimo 6 caracteres, 1 número e 1 letra maiúscula." });
        }

    try {
      const employee = await authService.login(cpf, password);
      return reply.status(200).send(employee);
    } catch (error) {
      return reply.status(401).send({ error: (error as Error).message });
    }
  }
}

export { AuthController };