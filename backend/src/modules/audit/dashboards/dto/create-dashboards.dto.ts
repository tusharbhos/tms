import { z } from 'zod';

// CREATE DTO for dashboards — validated business fields only.
export const CreateDashboardsSchema = z.object({
  name: z.string(),
  slug: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  roleId: z.number(),
  userId: z.number(),
  isDefault: z.boolean().optional().nullable(),
  layoutConfig: z.record(z.any()).optional().nullable(),
  status: z.string(),
});

export type CreateDashboardsDto = z.infer<typeof CreateDashboardsSchema>;