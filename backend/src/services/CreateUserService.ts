import  prisma  from '../prisma/index.js'

class CreateUserService {
  async execute(){
    console.log('Rota chamada');
    return {ok: true};
  }}

export { CreateUserService };