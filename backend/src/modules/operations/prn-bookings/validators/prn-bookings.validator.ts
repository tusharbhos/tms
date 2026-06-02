import { CreatePrnBookingsSchema } from '../dto/create-prn-bookings.dto';
import { UpdatePrnBookingsSchema } from '../dto/update-prn-bookings.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreatePrnBookingsSchema,
  update: UpdatePrnBookingsSchema,
};
