import { z } from 'zod';

// CREATE DTO for role — validated business fields only.
export const CreateRoleSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  roleLevel: z.number().optional().nullable(),
  isSystemRole: z.boolean().optional().nullable(),
  officeScope: z.string().optional().nullable(),
  departmentScope: z.string().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
});

export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;