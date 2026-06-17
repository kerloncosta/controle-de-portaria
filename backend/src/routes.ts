import type { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";

 // Importing controllers for Employee
  import { CreateEmployeeController } from "./controllers/controllersEmployee/CreateEmployeeController.js";
  import { ListEmployeeController } from "./controllers/controllersEmployee/ListEmployeeController.js";
  import { DeleteEmployeeController } from "./controllers/controllersEmployee/DeleteEmployeeController.js";
  import { FindEmployeeByCpfController } from "./controllers/controllersEmployee/FindEmployeeByCpfController.js";
  import {UpdateEmployeeController} from "./controllers/controllersEmployee/UpdateEmployeeController.js";

// Importing controllers for Manufacturer
  import { CreateManufacturerController } from "./controllers/controllersManufacturer/CreateManufacturerController.js";
  import { DeleteManufacturerController } from "./controllers/controllersManufacturer/DeleteManufacturerController.js";
  import { ListManufacturerController } from "./controllers/controllersManufacturer/ListManufacturerController.js";
  import { UpdateManufacturerController } from "./controllers/controllersManufacturer/UpdateManufacturerController.js";

// Importing controllers for VehicleModel
  import { CreateVehicleModelController } from "./controllers/controllersVehicleModel/CreateVehicleModelController.js";
  import { DeleteVehicleModelController } from "./controllers/controllersVehicleModel/DeleteVehicleModelController.js";
  import { ListVehicleModelController } from "./controllers/controllersVehicleModel/ListVehicleModelController.js";
  import { UpdateVehicleModelController } from "./controllers/controllersVehicleModel/UpdateVehicleModelController.js";


// Importing controllers for Driver
  import { CreateDriverController } from "./controllers/controllersDriver/CreateDriverController.js";
  import { DeleteDriverController } from "./controllers/controllersDriver/DeleteDriverController.js";
  import { ListDriverController } from "./controllers/controllersDriver/ListDriverController.js";
  import { FindDriverByCpfController } from "./controllers/controllersDriver/FindDriverByCpfController.js";
  import { FindDriverByCnhController } from "./controllers/controllersDriver/FindDriverByCnhController.js";
  import { UpdateDriverController } from "./controllers/controllersDriver/UpdateDriverController.js";

// Importing controllers for Vehicle
  import { CreateVehicleController } from "./controllers/controllersVehicle/CreateVehicleController.js";
  import { DeleteVehicleController } from "./controllers/controllersVehicle/DeleteVehicleController.js";
  import { ListVehicleController } from "./controllers/controllersVehicle/ListVehicleController.js";
  import { UpdateVehicleController } from "./controllers/controllersVehicle/UpdateVehicleController.js";
  import { FindVehicleByPlateController } from "./controllers/controllersVehicle/FindVehicleByPlateController.js";

// Importing controllers for Movement
import { CreateMovementController } from "./controllers/controllersMovement/CreateMovementController.js";
import { ListMovementController } from "./controllers/controllersMovement/ListMovementController.js";

export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {

  // Test route ---------------------------------------------------

  fastify.get("/test", async (request: FastifyRequest, reply: FastifyReply) => {
    return { hello: "world" };
  });

  // Employee routes ---------------------------------------------------

  fastify.post("/employee/add", async (request: FastifyRequest, reply: FastifyReply) => {
    return new CreateEmployeeController().handle(request, reply);
  });

  fastify.delete("/employee/delete/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new DeleteEmployeeController().handle(request, reply);
  });

  fastify.get("/employee/list", async (request: FastifyRequest, reply: FastifyReply) => {
    return new ListEmployeeController().handle(request, reply);
  });

  fastify.put("/employee/update/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new UpdateEmployeeController().handle(request, reply);
  });

  fastify.get("/employee/find-by-cpf/:cpf", async (request: FastifyRequest, reply: FastifyReply) => {
    return new FindEmployeeByCpfController().handle(request, reply);
  });

  // Manufacturer routes ---------------------------------------------------

  fastify.post("/manufacturer/add", async (request: FastifyRequest, reply: FastifyReply) => {
    return new CreateManufacturerController().handle(request, reply);
  });

  fastify.delete("/manufacturer/delete/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new DeleteManufacturerController().handle(request, reply);
  });

  fastify.get("/manufacturer/list", async (request: FastifyRequest, reply: FastifyReply) => {
    return new ListManufacturerController().handle(request, reply);
  });

  fastify.put("/manufacturer/update/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new UpdateManufacturerController().handle(request, reply);
  });

  // VehicleModel routes ---------------------------------------------------

  fastify.post("/vehicle-model/add", async (request: FastifyRequest, reply: FastifyReply) => {
    return new CreateVehicleModelController().handle(request, reply);
  });

  fastify.delete("/vehicle-model/delete/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new DeleteVehicleModelController().handle(request, reply);
  });

  fastify.get("/vehicle-model/list", async (request: FastifyRequest, reply: FastifyReply) => {
    return new ListVehicleModelController().handle(request, reply);
  });

  fastify.put("/vehicle-model/update/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new UpdateVehicleModelController().handle(request, reply);
  });

  // Driver routes ---------------------------------------------------

  fastify.post("/driver/add", async (request: FastifyRequest, reply: FastifyReply) => {
    return new CreateDriverController().handle(request, reply);
  });

  fastify.delete("/driver/delete/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new DeleteDriverController().handle(request, reply);
  });

  fastify.get("/driver/list", async (request: FastifyRequest, reply: FastifyReply) => {
    return new ListDriverController().handle(request, reply);
  });

  fastify.put("/driver/update/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new UpdateDriverController().handle(request, reply);
  });

  fastify.get("/driver/find-by-cnh/:cnh", async (request: FastifyRequest, reply: FastifyReply) => {
    return new FindDriverByCnhController().handle(request, reply);
  });

  fastify.get("/driver/find-by-cpf/:cpf", async (request: FastifyRequest, reply: FastifyReply) => {
    return new FindDriverByCpfController().handle(request, reply);
  });

  // Vehicle routes ---------------------------------------------------

  fastify.post("/vehicle/add", async (request: FastifyRequest, reply: FastifyReply) => {
    return new CreateVehicleController().handle(request, reply);
  });

  fastify.delete("/vehicle/delete/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new DeleteVehicleController().handle(request, reply);
  });

  fastify.get("/vehicle/list", async (request: FastifyRequest, reply: FastifyReply) => {
    return new ListVehicleController().handle(request, reply);
  });

  fastify.put("/vehicle/update/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return new UpdateVehicleController().handle(request, reply);
  });

  fastify.get("/vehicle/find-by-plate/:plate", async (request: FastifyRequest, reply: FastifyReply) => {
    return new FindVehicleByPlateController().handle(request, reply);
  });

  // Movement routes ------------------------------------------------
  
  fastify.post("/movement/add", async (request: FastifyRequest, reply: FastifyReply)=>{
    return new CreateMovementController().handle(request, reply);
  });

  fastify.get("/movement/list", async (request: FastifyRequest, reply: FastifyReply) => {
    return new ListMovementController().handle(request, reply);
  });
}