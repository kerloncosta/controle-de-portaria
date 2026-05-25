import type { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { CreateEmployeeController } from "./controllers/CreateEmployeeController.js";
import { ListEmployeeController } from "./controllers/ListEmployeesController.js";
import { DeleteEmployeeController } from "./controllers/DeleteEmployeeController.js";

export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {

  fastify.get("/test", async (request: FastifyRequest, reply: FastifyReply) => {
    return { hello: "world" };
  });

  fastify.post("/employee/add", async (request: FastifyRequest, reply: FastifyReply) => {
    return new CreateEmployeeController().handle(request, reply);
  });

  fastify.get("/employee/list", async (request: FastifyRequest, reply: FastifyReply) => {
    return new ListEmployeeController().handle(request, reply);
  });

  fastify.delete("/employee/delete", async (request: FastifyRequest, reply: FastifyReply) => {
    return new DeleteEmployeeController().handle(request, reply);
  });
}