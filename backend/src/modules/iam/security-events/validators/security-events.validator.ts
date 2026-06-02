import { CreateSecurityEventsSchema } from '../dto/create-security-events.dto';
import { UpdateSecurityEventsSchema } from '../dto/update-security-events.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateSecurityEventsSchema,
  update: UpdateSecurityEventsSchema,
};
