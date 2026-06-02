import { CreateUserOtpsSchema } from '../dto/create-user-otps.dto';
import { UpdateUserOtpsSchema } from '../dto/update-user-otps.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateUserOtpsSchema,
  update: UpdateUserOtpsSchema,
};
