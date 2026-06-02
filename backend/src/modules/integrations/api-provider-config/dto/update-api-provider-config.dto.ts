import { z } from 'zod';
import { CreateApiProviderConfigSchema } from './create-api-provider-config.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateApiProviderConfigSchema = CreateApiProviderConfigSchema.partial();
export type UpdateApiProviderConfigDto = z.infer<typeof UpdateApiProviderConfigSchema>;
