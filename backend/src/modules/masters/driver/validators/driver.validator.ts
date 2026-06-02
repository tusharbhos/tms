import { CreateDriverSchema } from '../dto/create-driver.dto';
import { UpdateDriverSchema } from '../dto/update-driver.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateDriverSchema,
  update: UpdateDriverSchema,
};
