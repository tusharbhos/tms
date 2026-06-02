import { z } from 'zod';
import { CreateDriverSchema } from './create-driver.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateDriverSchema = CreateDriverSchema.partial();
export type UpdateDriverDto = z.infer<typeof UpdateDriverSchema>;
