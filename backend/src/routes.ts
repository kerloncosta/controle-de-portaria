import type { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";

 // Importing controllers for Employee
import { CreateEmployeeController } from "./controllers/controllersEmployee/CreateEmployeeController.js";
import { ListEmployeeController } from "./controllers/controllersEmployee/ListEmployeesController.js";
import { DeleteEmployeeController } from "./controllers/controllersEmployee/DeleteEmployeeController.js";
import { FindEmployeeByCpfController } from "./controllers/controllersEmployee/FindEmployeeByCpfController.js";
import {UpdateEmployeeController} from "./controllers/controllersEmployee/UpdateEmployeeController.js";

// Importing controllers for Manufacturer
import { CreateManufacturerController } from "./controllers/controllersManufacturer/CreateManufacturerController.js";
import { DeleteManufacturerController } from "./controllers/controllersManufacturer/DeleteManufacturerController.js";

export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {

  fastify.get("/test", async (request: FastifyRequest, reply: FastifyReply) => {
    return { hello: "world" };
  });

  // Employee routes

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

  // Manufacturer routes

  fastify.post("/manufacturer/add", async (request: FastifyRequest, reply: FastifyReply) => {
    return new CreateManufacturerController().handle(request, reply);
  });

  fastify.delete("/manufacturer/delete/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new DeleteManufacturerController().handle(request, reply);
  });

}