import { CreateLoginAttemptsSchema } from '../dto/create-login-attempts.dto';
import { UpdateLoginAttemptsSchema } from '../dto/update-login-attempts.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateLoginAttemptsSchema,
  update: UpdateLoginAttemptsSchema,
};
