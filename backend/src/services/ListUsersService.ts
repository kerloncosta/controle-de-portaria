import prisma from '../prisma/index.js';

class ListUsersService {
  async  execute() {
    const users = await prisma.user.findMany({});
    return users;
  }
}

export { ListUsersService };