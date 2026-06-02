import { z } from 'zod';
import { CreateTripLrsSchema } from './create-trip-lrs.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateTripLrsSchema = CreateTripLrsSchema.partial();
export type UpdateTripLrsDto = z.infer<typeof UpdateTripLrsSchema>;
