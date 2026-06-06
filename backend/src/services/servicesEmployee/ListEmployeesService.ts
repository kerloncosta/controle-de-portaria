import prisma from '../../prisma/index.js';

class ListEmployeeService {
  async  execute() {
    const employees = await prisma.employee.findMany({});
    return employees;
  }
}

export { ListEmployeeService };