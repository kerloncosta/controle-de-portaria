import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ error: "Token não fornecido." });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
  return reply.status(401).send({ error: "Formato do token inválido." });
}

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET não está definido nas variáveis de ambiente.");
    }

    const decoded = jwt.verify(token , secret) as unknown as { id: string };
    (request as any).user = { id: decoded.id };
  } catch (err) {
    return reply.status(401).send({ error: "Token inválido ou expirado." });
  }
};