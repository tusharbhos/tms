import { z } from 'zod';

// CREATE DTO for txn_lr_state_log — validated business fields only.
export const CreateLrStateLogSchema = z.object({
  lrId: z.number(),
  fromStatus: z.string().optional().nullable(),
  toStatus: z.string().optional().nullable(),
  changedBy: z.number().optional().nullable(),
  changedAt: z.coerce.date().optional().nullable(),
  remarks: z.string().optional().nullable(),
  triggerEntity: z.string().optional().nullable(),
  triggerId: z.number(),
});

export type CreateLrStateLogDto = z.infer<typeof CreateLrStateLogSchema>;