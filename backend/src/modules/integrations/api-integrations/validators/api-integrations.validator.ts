import { CreateApiIntegrationsSchema } from '../dto/create-api-integrations.dto';
import { UpdateApiIntegrationsSchema } from '../dto/update-api-integrations.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateApiIntegrationsSchema,
  update: UpdateApiIntegrationsSchema,
};
