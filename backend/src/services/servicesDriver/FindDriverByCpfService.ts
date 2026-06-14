import prisma from '../../prisma/index.js';

interface FindDriverByCpfServiceRequest {
  cpf: string;
}

class FindDriverByCpfService {
  async execute({cpf}: FindDriverByCpfServiceRequest) {

    if(!cpf){
      throw new Error('O CPF é obrigatório para busca.');
    }
    
    const driver = await prisma.driver.findUnique({
      where: {
        cpf
      }
    });

    if(!driver){
      throw new Error('Motorista não encontrado.');
    }

    return driver;
  }  
}

export { FindDriverByCpfService };