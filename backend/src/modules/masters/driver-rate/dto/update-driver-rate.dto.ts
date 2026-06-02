import { z } from 'zod';
import { CreateDriverRateSchema } from './create-driver-rate.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateDriverRateSchema = CreateDriverRateSchema.partial();
export type UpdateDriverRateDto = z.infer<typeof UpdateDriverRateSchema>;
