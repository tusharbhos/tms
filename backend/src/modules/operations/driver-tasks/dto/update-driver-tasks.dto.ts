import { z } from 'zod';
import { CreateDriverTasksSchema } from './create-driver-tasks.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateDriverTasksSchema = CreateDriverTasksSchema.partial();
export type UpdateDriverTasksDto = z.infer<typeof UpdateDriverTasksSchema>;
