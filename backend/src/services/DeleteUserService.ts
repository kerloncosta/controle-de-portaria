import prisma from '../prisma/index.js';

interface DeleteUserPromps{
  cpf: string;
}

class DeleteUserService {
  async execute({ cpf }: DeleteUserPromps){

    if(!cpf){
      throw new Error("Informe o CPF do usuário a ser deletado");
    }

    const findUser = await prisma.user.findFirst({
      where: {
        cpf: cpf
      }
    })

    if(!findUser){
      throw new Error("Usuário não encontrado");
    }

    await prisma.user.delete({
      where: {
        cpf: findUser.cpf
      }
    })

    return { message: "Usuário deletado com sucesso" };

  }
}

export { DeleteUserService };