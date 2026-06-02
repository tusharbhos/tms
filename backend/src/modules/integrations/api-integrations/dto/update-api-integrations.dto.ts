import { z } from 'zod';
import { CreateApiIntegrationsSchema } from './create-api-integrations.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateApiIntegrationsSchema = CreateApiIntegrationsSchema.partial();
export type UpdateApiIntegrationsDto = z.infer<typeof UpdateApiIntegrationsSchema>;
