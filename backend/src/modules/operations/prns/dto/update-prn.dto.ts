import { z } from 'zod';
import { CreatePrnSchema } from './create-prn.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdatePrnSchema = CreatePrnSchema.partial();
export type UpdatePrnDto = z.infer<typeof UpdatePrnSchema>;
