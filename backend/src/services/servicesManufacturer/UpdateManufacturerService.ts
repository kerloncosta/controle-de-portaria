import prisma from '../../prisma/index.js';

class UpdateManufacturerService {
  async execute(id: number, name: string) {

    const manufacturerExists = await prisma.manufacturer.findUnique({
      where: {
        id: id
      }
    });

    if(!manufacturerExists){
      throw new Error('Fabricante não encontrado.');
    }
    
    const updatedManufacturer = await prisma.manufacturer.update({
      where:{
        id: id
      },
      data: {
        name: name ?? manufacturerExists.name,
      }
    });

    return updatedManufacturer;
  }
}



export { UpdateManufacturerService };