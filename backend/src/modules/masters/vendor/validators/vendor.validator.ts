import { CreateVendorSchema } from '../dto/create-vendor.dto';
import { UpdateVendorSchema } from '../dto/update-vendor.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateVendorSchema,
  update: UpdateVendorSchema,
};
