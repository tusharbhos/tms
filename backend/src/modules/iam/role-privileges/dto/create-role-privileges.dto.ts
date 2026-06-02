import { z } from 'zod';

// CREATE DTO for role_privileges — validated business fields only.
export const CreateRolePrivilegesSchema = z.object({
  roleId: z.number(),
  privilegeId: z.number(),
});

export type CreateRolePrivilegesDto = z.infer<typeof CreateRolePrivilegesSchema>;