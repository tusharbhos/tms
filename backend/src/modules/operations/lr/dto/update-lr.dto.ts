import { z } from 'zod';
import { CreateLrSchema } from './create-lr.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateLrSchema = CreateLrSchema.partial();
export type UpdateLrDto = z.infer<typeof UpdateLrSchema>;
