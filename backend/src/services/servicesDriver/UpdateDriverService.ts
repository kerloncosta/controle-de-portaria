import prisma from '../../prisma/index.js';

interface UpdateDriverProps {
  id: string;
  name?: string;
  cpf?: string;
  cnh?: string;
  cnh_expiration?: string;
}

class UpdateDriverService {
  async execute({ id, name, cpf, cnh, cnh_expiration }: UpdateDriverProps) {

    const driverExists = await prisma.driver.findUnique({
      where: {
        id,
      },
    });

    if (!driverExists) {
      throw new Error("Motorista não encontrado");
    }

    const expirationDate = cnh_expiration ? new Date(cnh_expiration) : driverExists.cnh_expiration;

    const updatedDriver = await prisma.driver.update({
      where: {
        id,
      },
      data: {
        name: name ?? driverExists.name,
        cpf: cpf ?? driverExists.cpf,
        cnh: cnh ?? driverExists.cnh,
        cnh_expiration: expirationDate,
      },
    });

    return updatedDriver;
  }
}

export { UpdateDriverService };