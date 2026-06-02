import { CreateExceptionLogsSchema } from '../dto/create-exception-logs.dto';
import { UpdateExceptionLogsSchema } from '../dto/update-exception-logs.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateExceptionLogsSchema,
  update: UpdateExceptionLogsSchema,
};
