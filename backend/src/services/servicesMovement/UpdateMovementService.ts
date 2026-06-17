import prisma from '../../prisma/index.js';
import { Prisma } from '@prisma/client';

interface UpdateMovementRequest {
  id: string;
  invoice_number?: string | null | undefined;
  cargo_description?: string | null | undefined;
  entry_time?: string | Date | undefined;
  exit_time?: string | Date | undefined;
  set_current_exit_time?: boolean | undefined;

  driver_id?: string | null | undefined; 
  new_driver?: {
    name: string;
    cpf: string;
    cnh: string;
    cnh_expiration: string | Date;
  } | null | undefined;

  vehicle_id?: string | null | undefined; 
  new_vehicle?: {
    plate: string;
    color: string;
    model_id: number;
  } | null | undefined;
}

class UpdateMovementService {
  async execute({ id, invoice_number, cargo_description, entry_time, exit_time, set_current_exit_time,driver_id, new_driver, vehicle_id, new_vehicle }: UpdateMovementRequest) {

    const movement =  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      
      const currentMovement = await tx.movement.findUnique({ where: { id } });
      if (!currentMovement) {
        throw new Error("Movimentação não encontrada.");
      }

      let finalDriverId = driver_id;
      let finalVehicleId = vehicle_id;

      if (!finalDriverId && new_driver) {
        const driverExists = await tx.driver.findFirst({
          where: { OR: [{ cpf: new_driver.cpf }, { cnh: new_driver.cnh }] }
        });

        if (driverExists) {
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

      if (!finalVehicleId && new_vehicle) {
        const vehicleExists = await tx.vehicle.findUnique({
          where: { plate: new_vehicle.plate }
        });

        if (vehicleExists) {
          throw new Error("Já existe um veículo cadastrado com esta placa.");
        }

        const createdVehicle = await tx.vehicle.create({
          data: {
            plate: new_vehicle.plate,
            color: new_vehicle.color,
            model_id: new_vehicle.model_id,
            driver_id: finalDriverId || currentMovement.driver_id,
          }
        });
        finalVehicleId = createdVehicle.id;
      }

      const parseLocalDate = (dateString: string | Date) => {
        if (dateString instanceof Date) return dateString;
        
        if (!dateString.endsWith('Z') && !dateString.includes('-') && !dateString.includes('+')) {
          return new Date(`${dateString}-03:00`); 
        }
        return new Date(dateString);
      };

      const actualEntryTime = entry_time ? parseLocalDate(entry_time) : currentMovement.entry_time;
      
      let actualExitTime: Date | undefined = undefined;
      if (exit_time) {
        actualExitTime = parseLocalDate(exit_time);
      } else if (set_current_exit_time) {
        actualExitTime = new Date(); 
      }

      if (actualExitTime && actualExitTime < actualEntryTime) {
        throw new Error("O horário de saída não pode ser menor que o horário de entrada.");
      }

      const updatedMovement = await tx.movement.update({
        where: { id },
        data: {
          invoice_number: invoice_number !== undefined ? invoice_number : undefined,
          cargo_description: cargo_description !== undefined ? cargo_description : undefined,
          driver_id: (typeof finalDriverId === 'string' && finalDriverId.trim() !== '') ? finalDriverId : undefined,
          vehicle_id: (typeof finalVehicleId === 'string' && finalVehicleId.trim() !== '') ? finalVehicleId : undefined,
          entry_time: entry_time ? actualEntryTime : undefined,
          exit_time: actualExitTime,
        },
        include: {
          driver: { select: { name: true, cpf: true } },
          vehicle: { select: { plate: true, color: true } }
        }
      });

      return updatedMovement;
    });

    return movement
  }
}

export { UpdateMovementService };