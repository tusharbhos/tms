import { z } from 'zod';
import { CreateSecurityEventsSchema } from './create-security-events.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateSecurityEventsSchema = CreateSecurityEventsSchema.partial();
export type UpdateSecurityEventsDto = z.infer<typeof UpdateSecurityEventsSchema>;
