import { z } from 'zod';
import { CreateVendorVoucherSchema } from './create-vendor-voucher.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateVendorVoucherSchema = CreateVendorVoucherSchema.partial();
export type UpdateVendorVoucherDto = z.infer<typeof UpdateVendorVoucherSchema>;
