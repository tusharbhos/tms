import { CreateVendorKycSchema } from '../dto/create-vendor-kyc.dto';
import { UpdateVendorKycSchema } from '../dto/update-vendor-kyc.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateVendorKycSchema,
  update: UpdateVendorKycSchema,
};
