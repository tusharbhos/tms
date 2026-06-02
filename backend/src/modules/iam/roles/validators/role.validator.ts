import { CreateRoleSchema } from '../dto/create-role.dto';
import { UpdateRoleSchema } from '../dto/update-role.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateRoleSchema,
  update: UpdateRoleSchema,
};
