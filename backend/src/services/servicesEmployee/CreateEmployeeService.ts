import prisma from '../../prisma/index.js';
import { hashPassword } from '../../utils/hashPassword.js';

interface CreateEmployeeProps {
  name: string;
  cpf: string;
  password: string;
  role: number;
}

class CreateEmployeeService {
  async execute({name, cpf, password, role}: CreateEmployeeProps) {
    
    if (!name || !cpf || !password || role === undefined) {
      throw new Error("Preencha todos os campos obrigatórios");
    }

    const existingEmployee = await prisma.employee.findUnique({
      where: {
        cpf,
      }
    })

    if (existingEmployee) {
      throw new Error("Já existe um funcionário cadastrado com esse CPF");
    }

    const hashedPassword = await hashPassword(password);

    const employee = await prisma.employee.create({
      data:{
        name,
        cpf,
        password: hashedPassword,
        role,
      }
    })

    return employee;
  }
}

export { CreateEmployeeService };