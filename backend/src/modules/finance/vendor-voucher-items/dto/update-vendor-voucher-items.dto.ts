import { z } from 'zod';
import { CreateVendorVoucherItemsSchema } from './create-vendor-voucher-items.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateVendorVoucherItemsSchema = CreateVendorVoucherItemsSchema.partial();
export type UpdateVendorVoucherItemsDto = z.infer<typeof UpdateVendorVoucherItemsSchema>;
