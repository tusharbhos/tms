import { CreateUsersSchema } from '../dto/create-users.dto';
import { UpdateUsersSchema } from '../dto/update-users.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateUsersSchema,
  update: UpdateUsersSchema,
};
