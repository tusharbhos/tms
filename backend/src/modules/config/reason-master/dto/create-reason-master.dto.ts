import { z } from 'zod';

// CREATE DTO for reason_master — validated business fields only.
export const CreateReasonMasterSchema = z.object({
  moduleName: z.string().optional().nullable(),
  reasonType: z.string().optional().nullable(),
  reasonCode: z.string().optional().nullable(),
  reasonText: z.string().optional().nullable(),
  requiresNote: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
});

export type CreateReasonMasterDto = z.infer<typeof CreateReasonMasterSchema>;