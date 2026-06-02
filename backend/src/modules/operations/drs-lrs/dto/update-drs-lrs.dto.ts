import { z } from 'zod';
import { CreateDrsLrsSchema } from './create-drs-lrs.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateDrsLrsSchema = CreateDrsLrsSchema.partial();
export type UpdateDrsLrsDto = z.infer<typeof UpdateDrsLrsSchema>;
