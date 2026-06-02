import { CreateVehiclesSchema } from '../dto/create-vehicles.dto';
import { UpdateVehiclesSchema } from '../dto/update-vehicles.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateVehiclesSchema,
  update: UpdateVehiclesSchema,
};
