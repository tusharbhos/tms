import { CreateActivityLogsSchema } from '../dto/create-activity-logs.dto';
import { UpdateActivityLogsSchema } from '../dto/update-activity-logs.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateActivityLogsSchema,
  update: UpdateActivityLogsSchema,
};
