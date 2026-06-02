import { CreateNotificationTemplatesSchema } from '../dto/create-notification-templates.dto';
import { UpdateNotificationTemplatesSchema } from '../dto/update-notification-templates.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateNotificationTemplatesSchema,
  update: UpdateNotificationTemplatesSchema,
};
