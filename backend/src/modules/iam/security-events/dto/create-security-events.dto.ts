import { z } from 'zod';

// CREATE DTO for security_events — validated business fields only.
export const CreateSecurityEventsSchema = z.object({
  userId: z.number(),
  eventType: z.string().optional().nullable(),
  severity: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  locationCity: z.string().optional().nullable(),
  locationCountry: z.string().optional().nullable(),
  triggeredBy: z.number().optional().nullable(),
  relatedLoginAttemptId: z.number(),
  eventAt: z.coerce.date().optional().nullable(),
  resolvedAt: z.coerce.date().optional().nullable(),
  resolvedBy: z.number().optional().nullable(),
  resolutionNotes: z.string().optional().nullable(),
  metadata: z.record(z.any()).optional().nullable(),
});

export type CreateSecurityEventsDto = z.infer<typeof CreateSecurityEventsSchema>;