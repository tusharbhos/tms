import { z } from 'zod';

// CREATE DTO for organizations — validated business fields only.
export const CreateOrganizationsSchema = z.object({
  parentOrganizationId: z.number().optional().nullable(),
  orgCode: z.string().optional().nullable(),
  orgName: z.string().optional().nullable(),
  orgNameReg: z.string().optional().nullable(),
  orgType: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  status: z.string(),
});

export type CreateOrganizationsDto = z.infer<typeof CreateOrganizationsSchema>;