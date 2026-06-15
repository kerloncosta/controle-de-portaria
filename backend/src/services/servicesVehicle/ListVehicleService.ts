import prisma from '../../prisma/index.js';

class ListVehicleService {
  async execute() {
    const vehicles = await prisma.vehicle.findMany({});
    return vehicles;
  }
}

export { ListVehicleService };