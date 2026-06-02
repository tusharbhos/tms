import { CreateDriverRateSchema } from '../dto/create-driver-rate.dto';
import { UpdateDriverRateSchema } from '../dto/update-driver-rate.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateDriverRateSchema,
  update: UpdateDriverRateSchema,
};
