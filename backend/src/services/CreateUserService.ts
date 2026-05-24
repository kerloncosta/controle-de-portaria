import prisma from '../prisma/index.js';

interface CreateUserProps {
  name: string;
  cpf: string;
  password: string;
  role: number;
}

class CreateUserService {
  async execute({name, cpf, password, role}: CreateUserProps) {
    
    if (!name || !cpf || !password || role === undefined) {
      throw new Error("Preencha todos os campos obrigatórios");
    }

    const user = await prisma.user.create({
      data:{
        name,
        cpf,
        password,
        role,
        status: true
      }
    })

    return user;
  }
}

export { CreateUserService };