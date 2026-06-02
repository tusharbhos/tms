import { CreateLrStateLogSchema } from '../dto/create-lr-state-log.dto';
import { UpdateLrStateLogSchema } from '../dto/update-lr-state-log.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateLrStateLogSchema,
  update: UpdateLrStateLogSchema,
};
