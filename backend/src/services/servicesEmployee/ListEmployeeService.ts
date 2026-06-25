import prisma from '../../prisma/index.js';

interface ListRequest {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
}

class ListEmployeeService {
  async  execute({page = 1, limit = 10, search = ""} : ListRequest ) {
    const skip = (page - 1) * limit;

    const whereCondition = search ? {name: {
      contains: search, mode: 'insensitive' as const}} : {};

    const totalEmloyees = await prisma.employee.count({
      where: whereCondition
    });

    const employees = await prisma.employee.findMany({
      where: whereCondition,
      skip: skip,
      take: limit,
      orderBy: { name: 'asc' }
    });

    return {
      data: employees,
      total: totalEmloyees, page,
      totalEmloyees: Math.ceil(totalEmloyees / limit)
    };
  }
}

export { ListEmployeeService };