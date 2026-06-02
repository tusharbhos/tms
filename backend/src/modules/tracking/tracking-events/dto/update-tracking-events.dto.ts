import { z } from 'zod';
import { CreateTrackingEventsSchema } from './create-tracking-events.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateTrackingEventsSchema = CreateTrackingEventsSchema.partial();
export type UpdateTrackingEventsDto = z.infer<typeof UpdateTrackingEventsSchema>;
