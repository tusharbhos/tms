import { z } from 'zod';
import { CreateLoaderRateSchema } from './create-loader-rate.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateLoaderRateSchema = CreateLoaderRateSchema.partial();
export type UpdateLoaderRateDto = z.infer<typeof UpdateLoaderRateSchema>;
