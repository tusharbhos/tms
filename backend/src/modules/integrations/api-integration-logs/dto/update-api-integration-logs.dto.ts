import { z } from 'zod';
import { CreateApiIntegrationLogsSchema } from './create-api-integration-logs.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateApiIntegrationLogsSchema = CreateApiIntegrationLogsSchema.partial();
export type UpdateApiIntegrationLogsDto = z.infer<typeof UpdateApiIntegrationLogsSchema>;
