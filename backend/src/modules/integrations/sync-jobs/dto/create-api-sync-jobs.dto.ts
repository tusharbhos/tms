import { z } from 'zod';

// CREATE DTO for api_sync_jobs — validated business fields only.
export const CreateApiSyncJobsSchema = z.object({
  integrationId: z.number(),
  entityType: z.string().optional().nullable(),
  entityId: z.number(),
  syncType: z.string().optional().nullable(),
  syncStatus: z.string().optional().nullable(),
  priority: z.string().optional().nullable(),
  scheduledAt: z.coerce.date().optional().nullable(),
  startedAt: z.coerce.date().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  requestPayload: z.record(z.any()).optional().nullable(),
  responsePayload: z.record(z.any()).optional().nullable(),
  httpStatusCode: z.number().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  retryCount: z.number().optional().nullable(),
  maxRetry: z.number().optional().nullable(),
  nextRetryAt: z.coerce.date().optional().nullable(),
});

export type CreateApiSyncJobsDto = z.infer<typeof CreateApiSyncJobsSchema>;