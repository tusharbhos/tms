import { z } from 'zod';
import { CreateUserSessionsSchema } from './create-user-sessions.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateUserSessionsSchema = CreateUserSessionsSchema.partial();
export type UpdateUserSessionsDto = z.infer<typeof UpdateUserSessionsSchema>;
