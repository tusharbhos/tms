import { CreateVendorVoucherItemsSchema } from '../dto/create-vendor-voucher-items.dto';
import { UpdateVendorVoucherItemsSchema } from '../dto/update-vendor-voucher-items.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateVendorVoucherItemsSchema,
  update: UpdateVendorVoucherItemsSchema,
};
