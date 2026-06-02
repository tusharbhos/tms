import { CreateTripSchema } from '../dto/create-trip.dto';
import { UpdateTripSchema } from '../dto/update-trip.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateTripSchema,
  update: UpdateTripSchema,
};
