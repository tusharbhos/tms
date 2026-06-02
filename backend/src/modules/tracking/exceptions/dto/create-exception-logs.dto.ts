import { z } from 'zod';

// CREATE DTO for txn_exception_logs — validated business fields only.
export const CreateExceptionLogsSchema = z.object({
  exceptionCode: z.string().optional().nullable(),
  severity: z.string().optional().nullable(),
  entityType: z.string().optional().nullable(),
  entityId: z.number(),
  lrId: z.number(),
  exceptionTitle: z.string().optional().nullable(),
  exceptionDetails: z.string().optional().nullable(),
  triggeredBy: z.string().optional().nullable(),
  triggerRefId: z.number(),
  resolutionStatus: z.string().optional().nullable(),
  assignedTo: z.number().optional().nullable(),
  resolutionAction: z.string().optional().nullable(),
  resolutionAt: z.coerce.date().optional().nullable(),
  customerNotified: z.boolean().optional().nullable(),
  exceptionImageUrl: z.string().optional().nullable(),
});

export type CreateExceptionLogsDto = z.infer<typeof CreateExceptionLogsSchema>;