import { CreateStatusChangeLogsSchema } from '../dto/create-status-change-logs.dto';
import { UpdateStatusChangeLogsSchema } from '../dto/update-status-change-logs.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateStatusChangeLogsSchema,
  update: UpdateStatusChangeLogsSchema,
};
