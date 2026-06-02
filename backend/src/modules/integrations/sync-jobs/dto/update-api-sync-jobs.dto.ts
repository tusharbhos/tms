import { z } from 'zod';
import { CreateApiSyncJobsSchema } from './create-api-sync-jobs.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateApiSyncJobsSchema = CreateApiSyncJobsSchema.partial();
export type UpdateApiSyncJobsDto = z.infer<typeof UpdateApiSyncJobsSchema>;
