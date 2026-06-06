import prisma from '../../prisma/index.js';

interface FindEmployeeByCpfServiceRequest {
  cpf: string;
}

class FindEmployeeByCpfService {
  async execute({cpf}: FindEmployeeByCpfServiceRequest) {

    if(!cpf){
      throw new Error('O CPF é obrigatório para busca.');
    }

    const employee = await prisma.employee.findUnique({
      where: {
        cpf
      }
    });

    if(!employee){
      throw new Error('Funcionário não encontrado.');
    }

    return employee;
  }
}

export { FindEmployeeByCpfService };