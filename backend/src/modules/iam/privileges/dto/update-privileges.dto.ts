import { z } from 'zod';
import { CreatePrivilegesSchema } from './create-privileges.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdatePrivilegesSchema = CreatePrivilegesSchema.partial();
export type UpdatePrivilegesDto = z.infer<typeof UpdatePrivilegesSchema>;
