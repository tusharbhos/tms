import { CreatePrivilegesSchema } from '../dto/create-privileges.dto';
import { UpdatePrivilegesSchema } from '../dto/update-privileges.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreatePrivilegesSchema,
  update: UpdatePrivilegesSchema,
};
