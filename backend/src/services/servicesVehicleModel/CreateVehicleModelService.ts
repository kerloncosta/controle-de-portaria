import prisma from '../../prisma/index.js';

interface CreateVehicleModelProps {
  name: string;
  manufacturer_id: number;
}

class CreateVehicleModelService {
  async execute({ name, manufacturer_id }: CreateVehicleModelProps) {

    if (!name || name.trim() === '') {
      throw new Error("O nome do modelo é obrigatório.");
    }
    if (!manufacturer_id) {
      throw new Error("O ID do fabricante é obrigatório.");
    }

    const manufacturerExists = await prisma.manufacturer.findUnique({
      where: { id: manufacturer_id }
    });

    if (!manufacturerExists) {
      throw new Error("Fabricante não encontrado. Impossível vincular o modelo.");
    }

    const vehicleModel = await prisma.vehicleModel.create({
      data: {
        name,
        manufacturer_id
      }
    });

    return vehicleModel;
  }
}

export { CreateVehicleModelService };