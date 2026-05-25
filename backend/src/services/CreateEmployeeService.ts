import prisma from '../prisma/index.js';

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

    const employee = await prisma.employee.create({
      data:{
        name,
        cpf,
        password,
        role,
      }
    })

    return employee;
  }
}

export { CreateEmployeeService };