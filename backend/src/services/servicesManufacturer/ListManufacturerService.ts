import prisma from '../../prisma/index.js';

class ListManufacturerService {
  async  execute() {
    const manufacturers = await prisma.manufacturer.findMany({});
    return manufacturers;
  }
}

export { ListManufacturerService };