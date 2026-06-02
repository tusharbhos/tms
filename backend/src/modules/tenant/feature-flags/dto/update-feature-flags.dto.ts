import { z } from 'zod';
import { CreateFeatureFlagsSchema } from './create-feature-flags.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateFeatureFlagsSchema = CreateFeatureFlagsSchema.partial();
export type UpdateFeatureFlagsDto = z.infer<typeof UpdateFeatureFlagsSchema>;
