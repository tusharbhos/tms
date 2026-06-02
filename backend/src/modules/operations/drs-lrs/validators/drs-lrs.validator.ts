import { CreateDrsLrsSchema } from '../dto/create-drs-lrs.dto';
import { UpdateDrsLrsSchema } from '../dto/update-drs-lrs.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateDrsLrsSchema,
  update: UpdateDrsLrsSchema,
};
