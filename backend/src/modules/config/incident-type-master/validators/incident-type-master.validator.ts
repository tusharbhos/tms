import { CreateIncidentTypeMasterSchema } from '../dto/create-incident-type-master.dto';
import { UpdateIncidentTypeMasterSchema } from '../dto/update-incident-type-master.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateIncidentTypeMasterSchema,
  update: UpdateIncidentTypeMasterSchema,
};
