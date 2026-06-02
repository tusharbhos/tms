import { z } from 'zod';
import { CreateStatusChangeLogsSchema } from './create-status-change-logs.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateStatusChangeLogsSchema = CreateStatusChangeLogsSchema.partial();
export type UpdateStatusChangeLogsDto = z.infer<typeof UpdateStatusChangeLogsSchema>;
