import prisma from '../../prisma/index.js';

interface DeleteVehicleProps{
  id: string;
}

class DeleteVehicleService {
  async execute({id}: DeleteVehicleProps){

    if(!id){
      throw new Error("Informe o ID do veículo a ser deletado");
    }

    const findVehicle = await prisma.vehicle.findFirst({
      where: {
        id: id
      }
    });

    if(!findVehicle){
      throw new Error("Veículo não encontrado");
    }

    try{
      await prisma.vehicle.delete({
        where: { id: findVehicle.id }
      });
    } catch (error: any){
        if (error.code === 'P2003') {
          throw new Error("Não é possível excluir este veículo pois ele possui histórico de movimentações no sistema.");
        }
      throw new Error("Erro interno ao deletar o veículo.");
    }

    return {message: "Veículo deletado com sucesso"};
  }
}

export { DeleteVehicleService }