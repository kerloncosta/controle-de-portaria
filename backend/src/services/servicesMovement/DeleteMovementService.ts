import prisma from '../../prisma/index.js';

interface DeleteMovementProps {
  id: string;
}

class DeleteMovementService {
  async execute({id} :DeleteMovementProps) {

    if(!id){
      throw new Error("Informe o ID do registro a ser deletado");
    }

    const findMovement = await prisma.movement.findFirst({
      where: {
        id: id
      }
    })

    if(!findMovement){
      throw new Error("Registro de entrada/saida não encontrado");
    }

    await prisma.movement.delete({
      where: {
        id: id
      }
    })

    return { message: "Registro deletado com sucesso"};
  }
}

export { DeleteMovementService };