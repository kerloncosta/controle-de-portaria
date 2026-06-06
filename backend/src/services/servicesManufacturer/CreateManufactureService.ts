import prisma from '../../prisma/index.js';


class CreateManufacturesService {

  async execute(name: string){

    if(!name || name.trim() === '') {
      throw new Error("O nome do fabricante é obrigatório");
    }


    const manufacture = await prisma.manufacturer.create({
      data: {
        name: name
      }
    });

    return manufacture;
  }
}

export { CreateManufacturesService };