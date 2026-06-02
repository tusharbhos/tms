import { z } from 'zod';

// CREATE DTO for notification_templates — validated business fields only.
export const CreateNotificationTemplatesSchema = z.object({
  eventCode: z.string().optional().nullable(),
  eventName: z.string().optional().nullable(),
  channel: z.string().optional().nullable(),
  languageCode: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  bodyHtml: z.string().optional().nullable(),
  variables: z.record(z.any()).optional().nullable(),
  senderId: z.string(),
  dltTemplateId: z.string(),
  provider: z.number().optional().nullable(),
  category: z.string().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  version: z.number().optional().nullable(),
});

export type CreateNotificationTemplatesDto = z.infer<typeof CreateNotificationTemplatesSchema>;