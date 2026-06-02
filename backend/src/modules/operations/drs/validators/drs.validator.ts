import { CreateDrsSchema } from '../dto/create-drs.dto';
import { UpdateDrsSchema } from '../dto/update-drs.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateDrsSchema,
  update: UpdateDrsSchema,
};
