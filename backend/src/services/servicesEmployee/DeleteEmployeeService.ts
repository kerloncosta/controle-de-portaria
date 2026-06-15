import prisma from '../../prisma/index.js';

interface DeleteEmployeeProps{
  id: string;
}

class DeleteEmployeeService {
  async execute({ id }: DeleteEmployeeProps){

    if(!id){
      throw new Error("Informe o ID do usuário a ser deletado");
    }

    const findEmployee = await prisma.employee.findFirst({
      where: {
        id: id
      }
    });

    if(!findEmployee){
      throw new Error("Funcionário não encontrado");
    }

    await prisma.employee.delete({
      where: {
        id: findEmployee.id
      }
    })

    return { message: "Usuário deletado com sucesso" };
  }
}

export { DeleteEmployeeService };