import { z } from 'zod';

// CREATE DTO for webhook_logs — validated business fields only.
export const CreateWebhookLogsSchema = z.object({
  webhookConfigId: z.number(),
  eventCode: z.string().optional().nullable(),
  entityType: z.string().optional().nullable(),
  entityId: z.number(),
  attemptNumber: z.number().optional().nullable(),
  parentLogId: z.number().optional().nullable(),
  url: z.string().optional().nullable(),
  method: z.string().optional().nullable(),
  requestHeaders: z.record(z.any()).optional().nullable(),
  requestPayload: z.string().optional().nullable(),
  responseStatus: z.number().optional().nullable(),
  responseBody: z.string().optional().nullable(),
  durationMs: z.number().optional().nullable(),
  isSuccess: z.boolean().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  triggeredAt: z.coerce.date().optional().nullable(),
  nextRetryAt: z.coerce.date().optional().nullable(),
});

export type CreateWebhookLogsDto = z.infer<typeof CreateWebhookLogsSchema>;