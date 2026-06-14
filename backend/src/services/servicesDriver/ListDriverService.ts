import prisma from '../../prisma/index.js';

class ListDriverService {
  async execute() {
    const drivers = await prisma.driver.findMany({});
    return drivers;
  }
}

export { ListDriverService };