import prisma from '../../prisma/index.js';

interface  FindVehicleByPlateServiceRequest{
  plate: string;
}

class FindVehicleByPlateService {
  async execute({plate}: FindVehicleByPlateServiceRequest){

    if(!plate){
      throw new Error('A placa é obrigatória para a busca.');
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        plate
      }
    });

    if(!vehicle){
      throw new Error('Veículo não encontrado.');
    }

    return vehicle;
  }
}

export { FindVehicleByPlateService };