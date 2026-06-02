import { z } from 'zod';
import { CreateLrStateLogSchema } from './create-lr-state-log.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateLrStateLogSchema = CreateLrStateLogSchema.partial();
export type UpdateLrStateLogDto = z.infer<typeof UpdateLrStateLogSchema>;
