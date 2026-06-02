import { z } from 'zod';

// CREATE DTO for webhook_configs — validated business fields only.
export const CreateWebhookConfigsSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  method: z.string().optional().nullable(),
  authType: z.string().optional().nullable(),
  authConfig: z.record(z.any()).optional().nullable(),
  customHeaders: z.record(z.any()).optional().nullable(),
  events: z.record(z.any()).optional().nullable(),
  payloadFormat: z.record(z.any()).optional().nullable(),
  payloadTemplate: z.string().optional().nullable(),
  timeoutSeconds: z.number().optional().nullable(),
  maxRetries: z.number().optional().nullable(),
  retryDelaySeconds: z.number().optional().nullable(),
  signingSecret: z.string().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  lastTriggeredAt: z.coerce.date().optional().nullable(),
  lastStatus: z.string().optional().nullable(),
});

export type CreateWebhookConfigsDto = z.infer<typeof CreateWebhookConfigsSchema>;