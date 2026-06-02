import { z } from 'zod';

// CREATE DTO for privileges — validated business fields only.
export const CreatePrivilegesSchema = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  moduleName: z.string().optional().nullable(),
  actionName: z.string().optional().nullable(),
  apiEndpoint: z.string().optional().nullable(),
  parentPrivilegeId: z.number().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
});

export type CreatePrivilegesDto = z.infer<typeof CreatePrivilegesSchema>;