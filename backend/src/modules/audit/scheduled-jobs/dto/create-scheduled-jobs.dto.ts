import { z } from 'zod';

// CREATE DTO for scheduled_jobs — validated business fields only.
export const CreateScheduledJobsSchema = z.object({
  jobName: z.string().optional().nullable(),
  cronExpression: z.string().optional().nullable(),
  jobHandler: z.string().optional().nullable(),
  retryAttempts: z.number().optional().nullable(),
  lastRunAt: z.coerce.date().optional().nullable(),
  nextRunAt: z.coerce.date().optional().nullable(),
  lastRunStatus: z.string().optional().nullable(),
  active: z.boolean().optional().nullable(),
});

export type CreateScheduledJobsDto = z.infer<typeof CreateScheduledJobsSchema>;