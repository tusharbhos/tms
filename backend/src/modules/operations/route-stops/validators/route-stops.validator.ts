import { CreateRouteStopsSchema } from '../dto/create-route-stops.dto';
import { UpdateRouteStopsSchema } from '../dto/update-route-stops.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateRouteStopsSchema,
  update: UpdateRouteStopsSchema,
};
