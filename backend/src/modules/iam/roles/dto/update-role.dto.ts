import { z } from 'zod';
import { CreateRoleSchema } from './create-role.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateRoleSchema = CreateRoleSchema.partial();
export type UpdateRoleDto = z.infer<typeof UpdateRoleSchema>;
