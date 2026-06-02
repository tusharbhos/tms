import { z } from 'zod';
import { CreateTenantFeatureFlagsSchema } from './create-tenant-feature-flags.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateTenantFeatureFlagsSchema = CreateTenantFeatureFlagsSchema.partial();
export type UpdateTenantFeatureFlagsDto = z.infer<typeof UpdateTenantFeatureFlagsSchema>;
