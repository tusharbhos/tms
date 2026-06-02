import { CreateClaimsSchema } from '../dto/create-claims.dto';
import { UpdateClaimsSchema } from '../dto/update-claims.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateClaimsSchema,
  update: UpdateClaimsSchema,
};
