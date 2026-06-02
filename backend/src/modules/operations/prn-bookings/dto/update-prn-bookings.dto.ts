import { z } from 'zod';
import { CreatePrnBookingsSchema } from './create-prn-bookings.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdatePrnBookingsSchema = CreatePrnBookingsSchema.partial();
export type UpdatePrnBookingsDto = z.infer<typeof UpdatePrnBookingsSchema>;
