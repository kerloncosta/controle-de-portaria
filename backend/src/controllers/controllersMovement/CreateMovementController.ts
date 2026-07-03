import type {FastifyRequest, FastifyReply} from 'fastify';
import { CreateMovementService } from '../../services/servicesMovement/CreateMovementService.js';
import { validateCnhFormat, validateCpfFormat, validatePlateFormat } from '../../utils/validators.js';

interface MovementBody {
  invoice_number?: string | undefined;
  cargo_description?: string | undefined;
  entry_time?: string | Date | undefined;

  driver_id?: string | undefined;
  new_driver?: {
    name: string;
    cpf: string;
    cnh: string;
    cnh_expiration: string | Date;
  } | undefined;

  vehicle_id?: string | undefined;
  new_vehicle?: {
    plate: string;
    color: string;
    model_id: number;
  } | undefined;
}

class CreateMovementController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const {invoice_number, cargo_description, entry_time, driver_id, new_driver, vehicle_id, new_vehicle } = request.body as MovementBody; 

      const employee_id = (request as any).user.id;

      if (!driver_id && !new_driver) {
        throw new Error("Você deve informar um motorista existente ou os dados para um novo cadastro.");
      }

      if (!vehicle_id && !new_vehicle) {
        throw new Error("Você deve informar um veículo existente ou os dados para um novo cadastro.");
      }

      if (new_driver) {
        if (!new_driver.name || !new_driver.cnh_expiration) {
          throw new Error("Para cadastrar um novo motorista, nome e validade da CNH são obrigatórios.");
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
          throw new Error("Para cadastrar um novo veículo, cor e modelo são obrigatórios.");
        }
        if (!validatePlateFormat(new_vehicle.plate)) {
          throw new Error("O formato da placa informada é inválido.");
        }
      }

      const createMovementService = new CreateMovementService();

      const movement = await createMovementService.execute({
        employee_id,
        invoice_number,
        cargo_description,
        entry_time,
        driver_id,
        new_driver,
        vehicle_id,
        new_vehicle
      });

      return reply.status(201).send(movement);

    }catch (error: any){
      return reply.status(400).send({ error:  (error as Error).message });
    }
  }
}

export { CreateMovementController };