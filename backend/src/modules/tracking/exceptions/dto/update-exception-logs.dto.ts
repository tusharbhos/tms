import { z } from 'zod';
import { CreateExceptionLogsSchema } from './create-exception-logs.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateExceptionLogsSchema = CreateExceptionLogsSchema.partial();
export type UpdateExceptionLogsDto = z.infer<typeof UpdateExceptionLogsSchema>;
