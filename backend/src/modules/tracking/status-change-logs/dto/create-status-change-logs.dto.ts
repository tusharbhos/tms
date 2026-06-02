import { z } from 'zod';

// CREATE DTO for txn_status_change_logs — validated business fields only.
export const CreateStatusChangeLogsSchema = z.object({
  entityType: z.string().optional().nullable(),
  entityId: z.number(),
  entityCode: z.string().optional().nullable(),
  oldStatus: z.string().optional().nullable(),
  newStatus: z.string().optional().nullable(),
  changedBy: z.number().optional().nullable(),
  changedAt: z.coerce.date().optional().nullable(),
  remarks: z.string().optional().nullable(),
  systemGenerated: z.boolean().optional().nullable(),
  triggerSource: z.string().optional().nullable(),
  triggerRefId: z.number(),
});

export type CreateStatusChangeLogsDto = z.infer<typeof CreateStatusChangeLogsSchema>;