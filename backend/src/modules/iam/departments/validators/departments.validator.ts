import { CreateDepartmentsSchema } from '../dto/create-departments.dto';
import { UpdateDepartmentsSchema } from '../dto/update-departments.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateDepartmentsSchema,
  update: UpdateDepartmentsSchema,
};
