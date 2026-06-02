import { CreateTenantFeatureFlagsSchema } from '../dto/create-tenant-feature-flags.dto';
import { UpdateTenantFeatureFlagsSchema } from '../dto/update-tenant-feature-flags.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateTenantFeatureFlagsSchema,
  update: UpdateTenantFeatureFlagsSchema,
};
