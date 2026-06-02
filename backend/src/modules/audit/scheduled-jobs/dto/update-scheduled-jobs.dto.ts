import { z } from 'zod';
import { CreateScheduledJobsSchema } from './create-scheduled-jobs.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateScheduledJobsSchema = CreateScheduledJobsSchema.partial();
export type UpdateScheduledJobsDto = z.infer<typeof UpdateScheduledJobsSchema>;
