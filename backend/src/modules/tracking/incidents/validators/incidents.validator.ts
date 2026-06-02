import { CreateIncidentsSchema } from '../dto/create-incidents.dto';
import { UpdateIncidentsSchema } from '../dto/update-incidents.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateIncidentsSchema,
  update: UpdateIncidentsSchema,
};
