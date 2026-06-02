import { z } from 'zod';
import { CreateBookingSchema } from './create-booking.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateBookingSchema = CreateBookingSchema.partial();
export type UpdateBookingDto = z.infer<typeof UpdateBookingSchema>;
