import { CreateVehicleLocationLogsSchema } from '../dto/create-vehicle-location-logs.dto';
import { UpdateVehicleLocationLogsSchema } from '../dto/update-vehicle-location-logs.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateVehicleLocationLogsSchema,
  update: UpdateVehicleLocationLogsSchema,
};
