import prisma from '../../prisma/index.js';

interface UpdateVehicleProps{
  id: string;
  plate?: string | undefined;
  color?: string | undefined;
  model_id?: number | undefined;
  driver_id?: string | undefined;
}

class UpdateVehicleService {
  async execute({id, plate, color, model_id, driver_id}: UpdateVehicleProps){

    const vehicleexists = await prisma.vehicle.findUnique({
      where: {
        id: id
      }
    });

    if(!vehicleexists){
      throw new Error('Veículo não encontrado.');
    }

    if (driver_id) {
      const driverExists = await prisma.driver.findUnique({
        where: { id: driver_id }
      });
      if (!driverExists) {
        throw new Error("O novo motorista informado não existe.");
      }
    }

    if (model_id !== undefined) {
      const modelExists = await prisma.vehicleModel.findUnique({
        where: { id: model_id }
      });
      if (!modelExists) {
        throw new Error("O novo modelo de veículo informado não é válido.");
      }
    }

    let formattedPlate = vehicleexists.plate;

    if (plate) {
      formattedPlate = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      
      const plateExists = await prisma.vehicle.findUnique({
        where: { plate: formattedPlate }
      });

      if (plateExists && plateExists.id !== id) {
        throw new Error("Já existe outro veículo cadastrado com esta placa.");
      }
    }

    const updateVehicle = await prisma.vehicle.update({
      where: {
        id
      },
      data: {
        plate: formattedPlate,
        color: color ?? vehicleexists.color,
        model_id: model_id ?? vehicleexists.model_id,
        driver_id: driver_id ?? vehicleexists.driver_id,
      }
    });

    return updateVehicle;
  }
}

export { UpdateVehicleService }