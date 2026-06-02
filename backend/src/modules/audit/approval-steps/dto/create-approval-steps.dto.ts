import { z } from 'zod';

// CREATE DTO for approval_steps — validated business fields only.
export const CreateApprovalStepsSchema = z.object({
  requestId: z.number(),
  stepNumber: z.number().optional().nullable(),
  stepName: z.string().optional().nullable(),
  approverType: z.string().optional().nullable(),
  approverUserId: z.number(),
  approverRoleId: z.number(),
  assignedAt: z.coerce.date().optional().nullable(),
  dueAt: z.coerce.date().optional().nullable(),
  actedBy: z.number().optional().nullable(),
  action: z.string().optional().nullable(),
  actedAt: z.coerce.date().optional().nullable(),
  remarks: z.string().optional().nullable(),
  status: z.string(),
});

export type CreateApprovalStepsDto = z.infer<typeof CreateApprovalStepsSchema>;