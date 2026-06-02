import { CreateOrganizationsSchema } from '../dto/create-organizations.dto';
import { UpdateOrganizationsSchema } from '../dto/update-organizations.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateOrganizationsSchema,
  update: UpdateOrganizationsSchema,
};
