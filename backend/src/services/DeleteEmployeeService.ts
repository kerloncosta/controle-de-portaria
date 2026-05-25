import prisma from '../prisma/index.js';

interface DeleteEmployeePromps{
  cpf: string;
}

class DeleteEmployeeService {
  async execute({ cpf }: DeleteEmployeePromps){

    if(!cpf){
      throw new Error("Informe o CPF do usuário a ser deletado");
    }

    const findEmployee = await prisma.employee.findFirst({
      where: {
        cpf: cpf
      }
    })

    if(!findEmployee){
      throw new Error("Funcionário não encontrado");
    }

    await prisma.employee.delete({
      where: {
        cpf: findEmployee.cpf
      }
    })

    return { message: "Usuário deletado com sucesso" };

  }
}

export { DeleteEmployeeService };