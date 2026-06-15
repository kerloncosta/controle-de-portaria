import prisma from '../../prisma/index.js';

interface CreateVehicleRequest{
  plate: string;
  color: string;
  model_id: number;
  driver_id: string;
}

class CreateVehicleService {
  async execute({ plate, model_id, color, driver_id }: CreateVehicleRequest) {

    if (!plate || model_id === undefined || !color || !driver_id) {
      throw new Error('Preencha todos os campos obrigatórios do veículo.');
    }

    const formattedPlate = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    const driverExists = await prisma.driver.findUnique({
      where: {id: driver_id}
    });

    if (!driverExists) {
      throw new Error("O motorista informado não existe.");
    }

    const modelExists = await prisma.vehicleModel.findUnique({
      where: { id: model_id }
    });

    if (!modelExists) {
      throw new Error("O modelo de veículo informado não é válido.");
    }

    const plateExists = await prisma.vehicle.findUnique({
      where: { plate: formattedPlate }
    });

    if (plateExists) {
      throw new Error("Já existe um veículo cadastrado com esta placa.");
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        plate: formattedPlate,
        color,
        model_id,
        driver_id
      }
    });

    return vehicle;
  }
}

export { CreateVehicleService };
