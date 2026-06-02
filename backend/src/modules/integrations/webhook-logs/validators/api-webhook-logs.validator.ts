import { CreateApiWebhookLogsSchema } from '../dto/create-api-webhook-logs.dto';
import { UpdateApiWebhookLogsSchema } from '../dto/update-api-webhook-logs.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateApiWebhookLogsSchema,
  update: UpdateApiWebhookLogsSchema,
};
