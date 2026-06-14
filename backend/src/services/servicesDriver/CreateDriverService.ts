import prisma from '../../prisma/index.js';

interface CreateDriverProps {
  name: string;
  cpf: string;
  cnh: string;
  cnh_expiration: string | Date;
}

class CreateDriverService {
  async execute({ name, cpf, cnh, cnh_expiration }: CreateDriverProps) {
    
    if (!name || !cpf || !cnh || !cnh_expiration) {
      throw new Error("Preencha todos os campos obrigatórios");
    }

    const existingDriver = await prisma.driver.findUnique({
      where: {
        cpf,
      }
    });

    if (existingDriver) {
      throw new Error("Já existe um motorista cadastrado com esse CPF");
    }

    const expirationDate = new Date(cnh_expiration);

    const driver = await prisma.driver.create({
      data: {
        name,
        cpf,
        cnh,
        cnh_expiration: expirationDate,
      }
    });

    return driver;
  }
}

export { CreateDriverService };