import { CreateOfficeSchema } from '../dto/create-office.dto';
import { UpdateOfficeSchema } from '../dto/update-office.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateOfficeSchema,
  update: UpdateOfficeSchema,
};
