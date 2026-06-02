import { z } from 'zod';
import { CreateOfficeSchema } from './create-office.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateOfficeSchema = CreateOfficeSchema.partial();
export type UpdateOfficeDto = z.infer<typeof UpdateOfficeSchema>;
