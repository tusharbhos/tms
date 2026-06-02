import { z } from 'zod';

// CREATE DTO for txn_notification_queue — validated business fields only.
export const CreateNotificationQueueSchema = z.object({
  eventCode: z.string().optional().nullable(),
  entityType: z.string().optional().nullable(),
  entityId: z.number(),
  channel: z.string().optional().nullable(),
  templateId: z.number(),
  recipientMobile: z.string().optional().nullable(),
  recipientEmail: z.string().email().optional().nullable(),
  message: z.string().optional().nullable(),
  variablesJson: z.record(z.any()).optional().nullable(),
  status: z.string(),
  provider: z.string().optional().nullable(),
  providerMsgId: z.string(),
  retryCount: z.number().optional().nullable(),
  scheduledAt: z.coerce.date().optional().nullable(),
  sentAt: z.coerce.date().optional().nullable(),
  errorMessage: z.string().optional().nullable(),
  maxRetry: z.number().optional().nullable(),
  nextRetryAt: z.coerce.date().optional().nullable(),
  webhookRequired: z.boolean().optional().nullable(),
});

export type CreateNotificationQueueDto = z.infer<typeof CreateNotificationQueueSchema>;