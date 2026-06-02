import { CreateEwaybillSchema } from '../dto/create-ewaybill.dto';
import { UpdateEwaybillSchema } from '../dto/update-ewaybill.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateEwaybillSchema,
  update: UpdateEwaybillSchema,
};
