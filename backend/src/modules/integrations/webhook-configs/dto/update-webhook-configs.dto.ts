import { z } from 'zod';
import { CreateWebhookConfigsSchema } from './create-webhook-configs.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateWebhookConfigsSchema = CreateWebhookConfigsSchema.partial();
export type UpdateWebhookConfigsDto = z.infer<typeof UpdateWebhookConfigsSchema>;
