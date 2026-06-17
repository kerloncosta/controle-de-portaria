import type { FastifyRequest, FastifyReply } from 'fastify';
import { UpdateMovementService } from '../../services/servicesMovement/UpdateMovementService.js';
import { validateCnhFormat, validateCpfFormat, validatePlateFormat } from '../../utils/validators.js';

interface UpdateMovementParams {
  id: string;
}

interface UpdateMovementBody {
  invoice_number?: string | null;
  cargo_description?: string | null;
  entry_time?: string;
  exit_time?: string;
  set_current_exit_time?: boolean;

  driver_id?: string | undefined;
  new_driver?: {
    name: string;
    cpf: string;
    cnh: string;
    cnh_expiration: string | Date;
  } | null;

  vehicle_id?: string | undefined;
  new_vehicle?: {
    plate: string;
    color: string;
    model_id: number;
  } | null;
}

class UpdateMovementController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as UpdateMovementParams;
      
      const { 
        invoice_number, cargo_description, entry_time, exit_time, set_current_exit_time,
        driver_id, new_driver, vehicle_id, new_vehicle 
      } = request.body as UpdateMovementBody;

      if (!id) {
        throw new Error("O ID da movimentação é obrigatório para atualização.");
      }

      if (new_driver) {
        if (!new_driver.name || !new_driver.cnh_expiration) {
          throw new Error("Para cadastrar um novo motorista no update, nome e validade da CNH são obrigatórios.");
        }
        if (!validateCpfFormat(new_driver.cpf)) {
          throw new Error("O CPF informado para o novo motorista é inválido.");
        }
        if (!validateCnhFormat(new_driver.cnh)) {
          throw new Error("A CNH informada para o novo motorista é inválida.");
        }
      }

      if (new_vehicle) {
        if (!new_vehicle.color || !new_vehicle.model_id) {
          throw new Error("Para cadastrar um novo veículo no update, cor e modelo são obrigatórios.");
        }
        if (!validatePlateFormat(new_vehicle.plate)) {
          throw new Error("O formato da placa informada é inválido.");
        }
      }

      const updateMovementService = new UpdateMovementService();

      const movement = await updateMovementService.execute({
        id,
        invoice_number,
        cargo_description,
        entry_time,
        exit_time,
        set_current_exit_time,
        driver_id,
        new_driver,
        vehicle_id,
        new_vehicle
      });

      return reply.status(200).send(movement);

    } catch (error: any) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  }
}

export { UpdateMovementController };