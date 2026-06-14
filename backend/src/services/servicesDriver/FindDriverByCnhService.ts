import prisma from '../../prisma/index.js';

interface FindDriverByCnhServiceRequest {
  cnh: string;
}

class FindDriverByCnhService {
  async execute({cnh}: FindDriverByCnhServiceRequest) {

    if(!cnh){
      throw new Error('A CNH é obrigatória para busca.');
    }

    const driver = await prisma.driver.findUnique({
      where: {
        cnh
      }
    });

    if(!driver){
      throw new Error('Motorista não encontrado.');
    }

    return driver;
  }
}

export { FindDriverByCnhService };