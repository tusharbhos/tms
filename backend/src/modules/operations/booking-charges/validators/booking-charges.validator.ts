import { CreateBookingChargesSchema } from '../dto/create-booking-charges.dto';
import { UpdateBookingChargesSchema } from '../dto/update-booking-charges.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateBookingChargesSchema,
  update: UpdateBookingChargesSchema,
};
