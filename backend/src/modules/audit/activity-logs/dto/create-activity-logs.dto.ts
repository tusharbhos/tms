import { z } from 'zod';

// CREATE DTO for activity_logs — validated business fields only.
export const CreateActivityLogsSchema = z.object({
  userId: z.number(),
  action: z.string().optional().nullable(),
  tableName: z.string().optional().nullable(),
  recordId: z.number(),
  oldValuesJson: z.record(z.any()).optional().nullable(),
  newValuesJson: z.record(z.any()).optional().nullable(),
  ipAddress: z.string().optional().nullable(),
  deviceInfo: z.string().optional().nullable(),
  browserInfo: z.string().optional().nullable(),
  sessionId: z.string(),
});

export type CreateActivityLogsDto = z.infer<typeof CreateActivityLogsSchema>;