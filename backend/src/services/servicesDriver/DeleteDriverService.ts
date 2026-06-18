import prisma from '../../prisma/index.js';

interface DeleteDriverProps {
  id: string;
} 

class DeleteDriverService {
  async execute({ id }: DeleteDriverProps) {

    if(!id){
      throw new Error("Informe o ID do motorista a ser deletado");
    }

    const hasVehicle = await prisma.vehicle.findFirst({
      where: { driver_id: id }
    });

    if (hasVehicle) {
      throw new Error("Não é possível excluir este motorista pois ele está vinculado a um veículo ativo.");
    }

    const findDriver = await prisma.driver.findFirst({
      where: {
        id: id
      }
    })

    if(!findDriver){
      throw new Error("Motorista não encontrado");
    }

    try {
      await prisma.driver.delete({
        where: {
          id: id
        }
      });

      return { message: "Motorista deletado com sucesso" };
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new Error("Não é possível excluir este motorista pois ele possui histórico de movimentações no sistema.");
      }

      throw new Error("Erro interno ao tentar excluir o motorista.");
    }
  }
}

export { DeleteDriverService };