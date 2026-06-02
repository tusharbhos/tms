import { CreateTrackingEventsSchema } from '../dto/create-tracking-events.dto';
import { UpdateTrackingEventsSchema } from '../dto/update-tracking-events.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateTrackingEventsSchema,
  update: UpdateTrackingEventsSchema,
};
