import prisma from '../../prisma/index.js';
import { Prisma } from '@prisma/client';

interface CreateMovementRequest {
  employee_id: string;
  invoice_number?: string;
  cargo_description?: string;

  driver_id?: string;
  new_driver?: {
    name: string;
    cpf: string;
    cnh: string;
    cnh_expiration: string | Date;
  };

  vehicle_id?: string;
  new_vehicle?: {
    plate: string;
    color: string;
    model_id: number;
  };
}

class CreateMovementService {
  async execute({ employee_id, invoice_number, cargo_description, driver_id, new_driver, vehicle_id, new_vehicle }: CreateMovementRequest){

    const movement = await prisma.$transaction(async (tx: Prisma.TransactionClient) =>{

      let finalDriverId = driver_id;
      let finalVehicleId = vehicle_id;

      if(!finalDriverId && new_driver){
        const driverExists = await tx.driver.findFirst({
          where: { OR: [ {cpf: new_driver.cpf}, {cnh: new_driver.cnh} ] }
        });

        if(driverExists){
          throw new Error("Já existe um motorista cadastrado com este CPF ou CNH");
        }

        const createdDriver = await tx.driver.create({
          data: {
              name: new_driver.name,
              cpf: new_driver.cpf,
              cnh: new_driver.cnh,
              cnh_expiration: new Date(new_driver.cnh_expiration),
          }
        });
        finalDriverId = createdDriver.id;
      }

      if(!finalVehicleId && new_vehicle) {
        const vehicleExists = await tx.vehicle.findUnique({
            where: { plate: new_vehicle.plate}
        });

        if(vehicleExists){
          throw new Error("Já existe um veículo cadastrado com esta placa.");
        }

        const createdVehicle = await tx.vehicle.create({
          data: {
            plate: new_vehicle.plate,
            color: new_vehicle.color,
            model_id: new_vehicle.model_id,
            driver_id: finalDriverId!, 
          }
        });
        finalVehicleId = createdVehicle.id;
      }

      const createdMovement = await tx.movement.create({
        data: {
          employee_id: employee_id,
          driver_id: finalDriverId!,
          vehicle_id: finalVehicleId!,
          invoice_number: invoice_number || null,
          cargo_description: cargo_description || null,
        },
        include: { driver: { select: { name: true, cpf: true } }, vehicle: { select: { plate: true, color: true } } }
      });

      return createdMovement;
    });

    return movement
  }
}

export { CreateMovementService };