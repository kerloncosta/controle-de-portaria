import prisma from '../../prisma/index.js';

interface DeleteDriverProps {
  id: string;
} 

class DeleteDriverService {
  async execute({ id }: DeleteDriverProps) {

    if(!id){
      throw new Error("Informe o ID do motorista a ser deletado");
    }

    const findDriver = await prisma.driver.findFirst({
      where: {
        id: id
      }
    })

    if(!findDriver){
      throw new Error("Motorista não encontrado");
    }

    await prisma.driver.delete({
      where: {
        id: id
      }
    })

    return { message: "Motorista deletado com sucesso" };
  }
}

export { DeleteDriverService };