import { CreateBookingSchema } from '../dto/create-booking.dto';
import { UpdateBookingSchema } from '../dto/update-booking.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateBookingSchema,
  update: UpdateBookingSchema,
};
