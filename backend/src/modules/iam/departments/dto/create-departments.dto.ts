import { z } from 'zod';

// CREATE DTO for departments — validated business fields only.
export const CreateDepartmentsSchema = z.object({
  parentDepartmentId: z.number().optional().nullable(),
  departmentCode: z.string().optional().nullable(),
  name: z.string(),
  hodUserId: z.number(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
});

export type CreateDepartmentsDto = z.infer<typeof CreateDepartmentsSchema>;