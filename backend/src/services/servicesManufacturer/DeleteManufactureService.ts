import prisma from '../../prisma/index.js';

class DeleteManufacturerService {
  async execute(id: number) {

    if (!id) {
      throw new Error("Informe o ID do fabricante a ser deletado");
    }

    const findManufacturer = await prisma.manufacturer.findFirst({
      where: {
        id: id
      }
    })

    if (!findManufacturer) {
      throw new Error("Fabricante não encontrado");
    }

    await prisma.manufacturer.delete({
      where: {
        id
      }
    })

    return { message: "Fabricante deletado com sucesso" };
  }
}

export { DeleteManufacturerService };