import { z } from 'zod';

// CREATE DTO for txn_api_webhook_logs — validated business fields only.
export const CreateApiWebhookLogsSchema = z.object({
  apiName: z.string().optional().nullable(),
  direction: z.string().optional().nullable(),
  entityType: z.string().optional().nullable(),
  entityId: z.number(),
  httpMethod: z.string().optional().nullable(),
  endpointUrl: z.string().optional().nullable(),
  requestPayload: z.record(z.any()).optional().nullable(),
  responsePayload: z.record(z.any()).optional().nullable(),
  statusCode: z.number().optional().nullable(),
  callStatus: z.string().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  retryCount: z.number().optional().nullable(),
  maxRetry: z.number().optional().nullable(),
  nextRetryAt: z.coerce.date().optional().nullable(),
  durationMs: z.number().optional().nullable(),
});

export type CreateApiWebhookLogsDto = z.infer<typeof CreateApiWebhookLogsSchema>;