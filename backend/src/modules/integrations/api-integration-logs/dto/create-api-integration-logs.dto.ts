import { z } from 'zod';

// CREATE DTO for api_integration_logs — validated business fields only.
export const CreateApiIntegrationLogsSchema = z.object({
  integrationId: z.number(),
  direction: z.string().optional().nullable(),
  method: z.string().optional().nullable(),
  requestUrl: z.string().optional().nullable(),
  requestHeaders: z.record(z.any()).optional().nullable(),
  requestPayload: z.string().optional().nullable(),
  responsePayload: z.string().optional().nullable(),
  statusCode: z.number().optional().nullable(),
  durationMs: z.number().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  errorCode: z.string().optional().nullable(),
  retryCount: z.number().optional().nullable(),
  isSuccess: z.boolean().optional().nullable(),
  entityType: z.string().optional().nullable(),
  entityId: z.number(),
  calledAt: z.coerce.date().optional().nullable(),
  respondedAt: z.coerce.date().optional().nullable(),
});

export type CreateApiIntegrationLogsDto = z.infer<typeof CreateApiIntegrationLogsSchema>;