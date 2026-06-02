import { z } from 'zod';
import { CreateApiWebhookLogsSchema } from './create-api-webhook-logs.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateApiWebhookLogsSchema = CreateApiWebhookLogsSchema.partial();
export type UpdateApiWebhookLogsDto = z.infer<typeof UpdateApiWebhookLogsSchema>;
