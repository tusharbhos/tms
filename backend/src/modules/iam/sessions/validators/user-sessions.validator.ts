import { CreateUserSessionsSchema } from '../dto/create-user-sessions.dto';
import { UpdateUserSessionsSchema } from '../dto/update-user-sessions.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateUserSessionsSchema,
  update: UpdateUserSessionsSchema,
};
