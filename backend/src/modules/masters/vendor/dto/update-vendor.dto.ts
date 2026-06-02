import { z } from 'zod';
import { CreateVendorSchema } from './create-vendor.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateVendorSchema = CreateVendorSchema.partial();
export type UpdateVendorDto = z.infer<typeof UpdateVendorSchema>;
