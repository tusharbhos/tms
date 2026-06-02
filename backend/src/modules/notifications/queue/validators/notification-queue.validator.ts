import { CreateNotificationQueueSchema } from '../dto/create-notification-queue.dto';
import { UpdateNotificationQueueSchema } from '../dto/update-notification-queue.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateNotificationQueueSchema,
  update: UpdateNotificationQueueSchema,
};
