import { CreateTripLrsSchema } from '../dto/create-trip-lrs.dto';
import { UpdateTripLrsSchema } from '../dto/update-trip-lrs.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateTripLrsSchema,
  update: UpdateTripLrsSchema,
};
