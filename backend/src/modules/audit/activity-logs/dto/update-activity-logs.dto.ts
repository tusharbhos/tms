import { z } from 'zod';
import { CreateActivityLogsSchema } from './create-activity-logs.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateActivityLogsSchema = CreateActivityLogsSchema.partial();
export type UpdateActivityLogsDto = z.infer<typeof UpdateActivityLogsSchema>;
