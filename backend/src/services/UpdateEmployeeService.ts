import prisma from '../prisma/index.js';

interface UpdateEmployeeProps{
  cpf: string;
  name?: string | undefined;
  password?: string | undefined;
  role?: number | undefined;
}

class UpdateEmployeeService {
  async execute({cpf, name, password, role}: UpdateEmployeeProps) {

    const employeeexists = await prisma.employee.findUnique({
      where: {
        cpf
      }
    });

    if(!employeeexists){
      throw new Error('Funcionário não encontrado.');
    }

    const updateEmployee = await prisma.employee.update({
      where: {
        cpf
      },
      data:{
        name: name ?? employeeexists.name,
        password: password ?? employeeexists.password,
        role: role ?? employeeexists.role,
      }
    });

    return updateEmployee;
  }
}

export { UpdateEmployeeService };