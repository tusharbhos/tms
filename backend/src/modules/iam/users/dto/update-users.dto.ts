import { z } from 'zod';
import { CreateUsersSchema } from './create-users.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateUsersSchema = CreateUsersSchema.partial();
export type UpdateUsersDto = z.infer<typeof UpdateUsersSchema>;
