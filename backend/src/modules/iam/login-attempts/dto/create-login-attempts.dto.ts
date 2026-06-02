import { z } from 'zod';

// CREATE DTO for login_attempts — validated business fields only.
export const CreateLoginAttemptsSchema = z.object({
  userId: z.number(),
  loginIdentifier: z.string().optional().nullable(),
  attemptedAt: z.coerce.date().optional().nullable(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  deviceInfo: z.string().optional().nullable(),
  loginStatus: z.string().optional().nullable(),
  failedReason: z.string().optional().nullable(),
  locationCity: z.string().optional().nullable(),
  locationCountry: z.string().optional().nullable(),
  sessionId: z.number(),
  isSuspicious: z.boolean().optional().nullable(),
});

export type CreateLoginAttemptsDto = z.infer<typeof CreateLoginAttemptsSchema>;