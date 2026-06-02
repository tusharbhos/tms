import { z } from 'zod';
import { CreateBookingChargesSchema } from './create-booking-charges.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateBookingChargesSchema = CreateBookingChargesSchema.partial();
export type UpdateBookingChargesDto = z.infer<typeof UpdateBookingChargesSchema>;
