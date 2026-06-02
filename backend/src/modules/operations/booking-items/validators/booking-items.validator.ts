import { CreateBookingItemsSchema } from '../dto/create-booking-items.dto';
import { UpdateBookingItemsSchema } from '../dto/update-booking-items.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateBookingItemsSchema,
  update: UpdateBookingItemsSchema,
};
