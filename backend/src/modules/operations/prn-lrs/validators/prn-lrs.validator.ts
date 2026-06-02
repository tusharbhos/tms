import { CreatePrnLrsSchema } from '../dto/create-prn-lrs.dto';
import { UpdatePrnLrsSchema } from '../dto/update-prn-lrs.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreatePrnLrsSchema,
  update: UpdatePrnLrsSchema,
};
