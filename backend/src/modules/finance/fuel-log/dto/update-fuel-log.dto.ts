import { z } from 'zod';
import { CreateFuelLogSchema } from './create-fuel-log.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateFuelLogSchema = CreateFuelLogSchema.partial();
export type UpdateFuelLogDto = z.infer<typeof UpdateFuelLogSchema>;
