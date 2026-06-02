import { z } from 'zod';
import { CreateBookingItemsSchema } from './create-booking-items.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateBookingItemsSchema = CreateBookingItemsSchema.partial();
export type UpdateBookingItemsDto = z.infer<typeof UpdateBookingItemsSchema>;
