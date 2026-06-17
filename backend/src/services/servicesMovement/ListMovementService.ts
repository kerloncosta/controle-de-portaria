import prisma from '../../prisma/index.js';

class ListMovementService {
  async execute(){
    const movements = await prisma.movement.findMany({
      orderBy: {
        entry_time: 'desc'
      },

      include: {
        driver: {
          select: {
            name: true,
            cpf: true,
            cnh: true
          }
        },
        vehicle: {
          select: {
            plate: true,
            color: true
          }
        },
        employee: {
          select: {
            name: true
          }
        }
      }
    });

    return movements;
  }
}

export { ListMovementService };