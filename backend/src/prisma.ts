import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Carrega as variáveis do seu arquivo .env
dotenv.config();

// Instancia o cliente com a URL que o Prisma 7 não aceita mais no schema.prisma
const prisma = new PrismaClient({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});

export { prisma };