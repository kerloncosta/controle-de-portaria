import prisma from '../prisma/index.js';

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

    const updateEmployee = await prisma.employee.update({
      where: {
        id
      },
      data:{
        name: name ?? employeeexists.name,
        cpf: cpf ?? employeeexists.cpf,
        password: password ?? employeeexists.password,
        role: role ?? employeeexists.role,
      }
    });

    return updateEmployee;
  }
}

export { UpdateEmployeeService };