import { z } from 'zod';

// CREATE DTO for user_otps — validated business fields only.
export const CreateUserOtpsSchema = z.object({
  userId: z.number(),
  loginId: z.string(),
  otpHash: z.string().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
  failedOtpLoginAttempts: z.number().optional().nullable(),
  otpLoginBlockedTill: z.coerce.date().optional().nullable(),
});

export type CreateUserOtpsDto = z.infer<typeof CreateUserOtpsSchema>;