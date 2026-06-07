import prisma from '../../prisma/index.js';

class DeleteVehicleModelService {
  async execute(id: number) {

    if(!id){
      throw new Error("Informe o ID do modelo de veículo a ser deletado");
    }

    const findVehicleModel = await prisma.vehicleModel.findFirst({
      where: {
        id: id
      }
    })

    if(!findVehicleModel){
      throw new Error("Modelo de veículo não encontrado");
    }

    return prisma.vehicleModel.delete({
      where: {
        id
      }
    })

    return  { message: "Modelo de veículo deletado com sucesso" };
  }
}

export { DeleteVehicleModelService };