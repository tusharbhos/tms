import { z } from 'zod';
import { CreateTripSchema } from './create-trip.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateTripSchema = CreateTripSchema.partial();
export type UpdateTripDto = z.infer<typeof UpdateTripSchema>;
