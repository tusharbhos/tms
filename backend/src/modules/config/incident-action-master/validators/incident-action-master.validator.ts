import { CreateIncidentActionMasterSchema } from '../dto/create-incident-action-master.dto';
import { UpdateIncidentActionMasterSchema } from '../dto/update-incident-action-master.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateIncidentActionMasterSchema,
  update: UpdateIncidentActionMasterSchema,
};
