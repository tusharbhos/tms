import { CreateTenantSchema } from '../dto/create-tenant.dto';
import { UpdateTenantSchema } from '../dto/update-tenant.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateTenantSchema,
  update: UpdateTenantSchema,
};
