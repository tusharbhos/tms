import { z } from 'zod';
import { CreateRolePrivilegesSchema } from './create-role-privileges.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateRolePrivilegesSchema = CreateRolePrivilegesSchema.partial();
export type UpdateRolePrivilegesDto = z.infer<typeof UpdateRolePrivilegesSchema>;
