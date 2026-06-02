import { z } from 'zod';
import { CreateTenantKycSchema } from './create-tenant-kyc.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateTenantKycSchema = CreateTenantKycSchema.partial();
export type UpdateTenantKycDto = z.infer<typeof UpdateTenantKycSchema>;
