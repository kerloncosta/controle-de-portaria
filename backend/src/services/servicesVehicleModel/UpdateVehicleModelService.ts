import prisma from '../../prisma/index.js';

interface UpdateVehicleModelProps{
  id: number;
  name?: string | undefined;
  manufacturer_id?: number | undefined;
} 

class UpdateVehicleModelService {
  async execute({id, name, manufacturer_id}: UpdateVehicleModelProps) {

    const vehicleModelexists = await prisma.vehicleModel.findUnique({
      where: {
        id: id
      }
    });

    if(!vehicleModelexists){
      throw new Error('Modelo de veículo não encontrado.');
    }

    const updateVehicleModel = await prisma.vehicleModel.update({
      where: {
        id
      },
      data:{
        name: name ?? vehicleModelexists.name,
        manufacturer_id: manufacturer_id ?? vehicleModelexists.manufacturer_id,
      }
    });

    return updateVehicleModel;
  }
}

export { UpdateVehicleModelService };