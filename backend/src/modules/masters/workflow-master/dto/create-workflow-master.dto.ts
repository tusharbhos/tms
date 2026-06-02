import { z } from 'zod';

// CREATE DTO for workflow_master — validated business fields only.
export const CreateWorkflowMasterSchema = z.object({
  name: z.string(),
  module: z.string().optional().nullable(),
  approvalType: z.string().optional().nullable(),
  escalationHours: z.number().optional().nullable(),
  autoApprovalHours: z.number().optional().nullable(),
  escalationUserId: z.number(),
  description: z.string().optional().nullable(),
  active: z.boolean().optional().nullable(),
});

export type CreateWorkflowMasterDto = z.infer<typeof CreateWorkflowMasterSchema>;