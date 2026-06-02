import { CreateTenantKycSchema } from '../dto/create-tenant-kyc.dto';
import { UpdateTenantKycSchema } from '../dto/update-tenant-kyc.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateTenantKycSchema,
  update: UpdateTenantKycSchema,
};
