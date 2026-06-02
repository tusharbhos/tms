import { z } from 'zod';

// CREATE DTO for user_sessions — validated business fields only.
export const CreateUserSessionsSchema = z.object({
  userId: z.number(),
  sessionTokenHash: z.string().optional().nullable(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  deviceType: z.string().optional().nullable(),
  deviceInfo: z.string().optional().nullable(),
  locationCity: z.string().optional().nullable(),
  locationCountry: z.string().optional().nullable(),
  locationLat: z.number().optional().nullable(),
  locationLng: z.number().optional().nullable(),
  sessionStartedAt: z.coerce.date().optional().nullable(),
  lastActiveAt: z.coerce.date().optional().nullable(),
  sessionEndedAt: z.coerce.date().optional().nullable(),
  endReason: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
});

export type CreateUserSessionsDto = z.infer<typeof CreateUserSessionsSchema>;