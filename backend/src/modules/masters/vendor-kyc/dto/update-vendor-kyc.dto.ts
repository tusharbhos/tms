import { z } from 'zod';
import { CreateVendorKycSchema } from './create-vendor-kyc.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateVendorKycSchema = CreateVendorKycSchema.partial();
export type UpdateVendorKycDto = z.infer<typeof UpdateVendorKycSchema>;
