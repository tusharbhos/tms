import { z } from 'zod';
import { CreateTenantSchema } from './create-tenant.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateTenantSchema = CreateTenantSchema.partial();
export type UpdateTenantDto = z.infer<typeof UpdateTenantSchema>;
