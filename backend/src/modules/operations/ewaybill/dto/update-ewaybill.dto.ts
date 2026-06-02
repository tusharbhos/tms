import { z } from 'zod';
import { CreateEwaybillSchema } from './create-ewaybill.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateEwaybillSchema = CreateEwaybillSchema.partial();
export type UpdateEwaybillDto = z.infer<typeof UpdateEwaybillSchema>;
