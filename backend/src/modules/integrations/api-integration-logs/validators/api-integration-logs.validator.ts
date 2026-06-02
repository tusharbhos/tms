import { CreateApiIntegrationLogsSchema } from '../dto/create-api-integration-logs.dto';
import { UpdateApiIntegrationLogsSchema } from '../dto/update-api-integration-logs.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateApiIntegrationLogsSchema,
  update: UpdateApiIntegrationLogsSchema,
};
