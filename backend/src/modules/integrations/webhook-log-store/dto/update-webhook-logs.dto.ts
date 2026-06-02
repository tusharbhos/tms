import { z } from 'zod';
import { CreateWebhookLogsSchema } from './create-webhook-logs.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateWebhookLogsSchema = CreateWebhookLogsSchema.partial();
export type UpdateWebhookLogsDto = z.infer<typeof UpdateWebhookLogsSchema>;
