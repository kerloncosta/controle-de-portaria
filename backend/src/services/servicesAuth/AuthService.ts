import prisma from '../../prisma/index.js';
import brcypt from 'bcrypt';
import jwt from "jsonwebtoken";

class AuthService {
  async login(cpf: string, password: string) {
    const employee = await prisma.employee.findUnique({
      where: {
        cpf,
      },
    });

    if(!employee) {
      throw new Error('Funcionario não encontrado');
    }

    const isMatch = await brcypt.compare(password, employee.password);

    if(!isMatch) {
      throw new Error('Senha incorreta');
    }

    const token = jwt.sign({ id: employee.id }, process.env.JWT_SECRET as string, { expiresIn: '2h' });

    const { password: _, ...employeeWithoutPassword } = employee;
    return { user: employeeWithoutPassword, token };
  }
}

export { AuthService };

