import { CreateDriverTasksSchema } from '../dto/create-driver-tasks.dto';
import { UpdateDriverTasksSchema } from '../dto/update-driver-tasks.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateDriverTasksSchema,
  update: UpdateDriverTasksSchema,
};
