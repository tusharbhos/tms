import { CreateRolePrivilegesSchema } from '../dto/create-role-privileges.dto';
import { UpdateRolePrivilegesSchema } from '../dto/update-role-privileges.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateRolePrivilegesSchema,
  update: UpdateRolePrivilegesSchema,
};
