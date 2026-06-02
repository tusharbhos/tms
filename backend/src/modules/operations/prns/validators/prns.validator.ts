import { CreatePrnSchema } from '../dto/create-prn.dto';
import { UpdatePrnSchema } from '../dto/update-prn.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreatePrnSchema,
  update: UpdatePrnSchema,
};
