import { z } from 'zod';
import { CreateRouteStopsSchema } from './create-route-stops.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateRouteStopsSchema = CreateRouteStopsSchema.partial();
export type UpdateRouteStopsDto = z.infer<typeof UpdateRouteStopsSchema>;
