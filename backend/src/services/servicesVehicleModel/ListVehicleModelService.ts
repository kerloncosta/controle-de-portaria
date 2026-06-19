import prisma from '../../prisma/index.js';

class ListVehicleModelService {
  async  execute() {
    const vehicleModels = await prisma.vehicleModel.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        manufacturer: true,
      }
    });
    return vehicleModels;
  }
}

export { ListVehicleModelService };