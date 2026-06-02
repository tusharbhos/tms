import { z } from 'zod';

// CREATE DTO for approval_action_logs — validated business fields only.
export const CreateApprovalActionLogsSchema = z.object({
  requestId: z.number(),
  stepId: z.number(),
  actionBy: z.number().optional().nullable(),
  action: z.string().optional().nullable(),
  actionAt: z.coerce.date().optional().nullable(),
  remarks: z.string().optional().nullable(),
  previousStatus: z.string().optional().nullable(),
  newStatus: z.string().optional().nullable(),
  ipAddress: z.string().optional().nullable(),
  deviceInfo: z.string().optional().nullable(),
});

export type CreateApprovalActionLogsDto = z.infer<typeof CreateApprovalActionLogsSchema>;