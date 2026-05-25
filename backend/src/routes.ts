import type { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { CreateUserController } from "./controllers/CreateUserController.js";
import { ListUsersController } from "./controllers/ListUsersController.js";
import { DeleteUserController } from "./controllers/DeleteUserController.js";

export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {

  fastify.get("/test", async (request: FastifyRequest, reply: FastifyReply) => {
    return { hello: "world" };
  });

  fastify.post("/user/add", async (request: FastifyRequest, reply: FastifyReply) => {
    return new CreateUserController().handle(request, reply);
  });

  fastify.get("/user/list", async (request: FastifyRequest, reply: FastifyReply) => {
    return new ListUsersController().handle(request, reply);
  });

  fastify.delete("/user/delete", async (request: FastifyRequest, reply: FastifyReply) => {
    return new DeleteUserController().handle(request, reply);
  });
}