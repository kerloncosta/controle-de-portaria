import prisma from '../../prisma/index.js';


class CreateManufacturerService {

  async execute(name: string){

    if(!name || name.trim() === '') {
      throw new Error("O nome do fabricante é obrigatório");
    }


    const manufacturer = await prisma.manufacturer.create({
      data: {
        name: name
      }
    });

    return manufacturer;
  }
}

export { CreateManufacturerService };