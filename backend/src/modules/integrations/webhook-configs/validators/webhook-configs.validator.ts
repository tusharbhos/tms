import { CreateWebhookConfigsSchema } from '../dto/create-webhook-configs.dto';
import { UpdateWebhookConfigsSchema } from '../dto/update-webhook-configs.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateWebhookConfigsSchema,
  update: UpdateWebhookConfigsSchema,
};
