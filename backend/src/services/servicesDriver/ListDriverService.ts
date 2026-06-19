import prisma from '../../prisma/index.js';


interface ListRequest {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
}

class ListDriverService {
  async execute({page = 1, limit = 10, search = ""} : ListRequest ) {
    const skip = (page - 1) * limit;

    const whereCondition = search ? {name: {
      contains: search, mode: 'insensitive' as const}} : {};

    const totalDrivers = await prisma.driver.count({
      where: whereCondition
    });

    const drivers = await prisma.driver.findMany({
      where: whereCondition,
      skip: skip,
      take: limit,
      orderBy: { name: 'asc' }
    });
    return {
      data: drivers,
      total: totalDrivers, page,
      totalDrivers: Math.ceil(totalDrivers / limit)
    };
  }
}

export { ListDriverService };