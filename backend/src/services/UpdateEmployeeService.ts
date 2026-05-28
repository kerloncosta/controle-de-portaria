import prisma from '../prisma/index.js';
import { hashPassword } from '../utils/hashPassword.js';

interface UpdateEmployeeProps{
  id: string;
  cpf?: string | undefined;
  name?: string | undefined;
  password?: string | undefined;
  role?: number | undefined;
}

class UpdateEmployeeService {
  async execute({id, cpf, name, password, role}: UpdateEmployeeProps) {

    const employeeexists = await prisma.employee.findUnique({
      where: {
        id: id
      }
    });

    if(!employeeexists){
      throw new Error('Funcionário não encontrado.');
    }

    let hashedPassword = employeeexists.password;

    if(password){
      hashedPassword = await hashPassword(password);
    }

    const updateEmployee = await prisma.employee.update({
      where: {
        id
      },
      data:{
        name: name ?? employeeexists.name,
        cpf: cpf ?? employeeexists.cpf,
        password: hashedPassword,
        role: role ?? employeeexists.role,
      }
    });

    return updateEmployee;
  }
}

export { UpdateEmployeeService };