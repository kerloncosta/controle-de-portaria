import type { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";

import { CreateEmployeeController } from "./controllers/CreateEmployeeController.js";
import { ListEmployeeController } from "./controllers/ListEmployeesController.js";
import { DeleteEmployeeController } from "./controllers/DeleteEmployeeController.js";
import { FindEmployeeByCpfController } from "./controllers/FindEmployeeByCpfController.js";
import {UpdateEmployeeController} from "./controllers/UpdateEmployeeController.js";

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

  fastify.delete("/employee/delete/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new DeleteEmployeeController().handle(request, reply);
  });

  fastify.get("/employee/find-by-cpf/:cpf", async (request: FastifyRequest, reply: FastifyReply) => {
    return new FindEmployeeByCpfController().handle(request, reply);
  });

  fastify.put("/employee/update/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new UpdateEmployeeController().handle(request, reply);
  });

}