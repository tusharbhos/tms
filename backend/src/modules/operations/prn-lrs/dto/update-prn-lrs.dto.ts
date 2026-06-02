import { z } from 'zod';
import { CreatePrnLrsSchema } from './create-prn-lrs.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdatePrnLrsSchema = CreatePrnLrsSchema.partial();
export type UpdatePrnLrsDto = z.infer<typeof UpdatePrnLrsSchema>;
