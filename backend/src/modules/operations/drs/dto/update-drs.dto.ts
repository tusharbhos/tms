import { z } from 'zod';
import { CreateDrsSchema } from './create-drs.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateDrsSchema = CreateDrsSchema.partial();
export type UpdateDrsDto = z.infer<typeof UpdateDrsSchema>;
