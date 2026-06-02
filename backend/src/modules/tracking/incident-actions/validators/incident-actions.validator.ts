import { CreateIncidentActionsSchema } from '../dto/create-incident-actions.dto';
import { UpdateIncidentActionsSchema } from '../dto/update-incident-actions.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateIncidentActionsSchema,
  update: UpdateIncidentActionsSchema,
};
