import { z } from 'zod';
import { CreateLoginAttemptsSchema } from './create-login-attempts.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateLoginAttemptsSchema = CreateLoginAttemptsSchema.partial();
export type UpdateLoginAttemptsDto = z.infer<typeof UpdateLoginAttemptsSchema>;
