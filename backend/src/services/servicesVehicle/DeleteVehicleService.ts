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

    await prisma.vehicle.delete({
      where: {
        id: findVehicle.id
      }
    })

    return {message: "Veículo deletado com sucesso"};
  }
}

export { DeleteVehicleService }