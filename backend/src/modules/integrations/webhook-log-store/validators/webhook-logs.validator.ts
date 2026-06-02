import { CreateWebhookLogsSchema } from '../dto/create-webhook-logs.dto';
import { UpdateWebhookLogsSchema } from '../dto/update-webhook-logs.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateWebhookLogsSchema,
  update: UpdateWebhookLogsSchema,
};
