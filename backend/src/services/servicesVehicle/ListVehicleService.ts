import prisma from '../../prisma/index.js';

class ListVehicleService {
  async execute() {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        model: {
          include: {
            manufacturer: true
          }
        },
        driver: true
      }
    });

    return vehicles;
  }
}

export { ListVehicleService };