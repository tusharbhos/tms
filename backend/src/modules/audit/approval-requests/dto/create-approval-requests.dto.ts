import { z } from 'zod';

// CREATE DTO for approval_requests — validated business fields only.
export const CreateApprovalRequestsSchema = z.object({
  workflowId: z.number(),
  entityType: z.string().optional().nullable(),
  entityId: z.number(),
  referenceCode: z.string().optional().nullable(),
  requestedBy: z.number().optional().nullable(),
  requestedAt: z.coerce.date().optional().nullable(),
  currentStep: z.number().optional().nullable(),
  totalSteps: z.number().optional().nullable(),
  status: z.string(),
  priority: z.string().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
  remarks: z.string().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  completedBy: z.number().optional().nullable(),
});

export type CreateApprovalRequestsDto = z.infer<typeof CreateApprovalRequestsSchema>;