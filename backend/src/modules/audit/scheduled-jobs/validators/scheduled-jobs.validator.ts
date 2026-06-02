import { CreateScheduledJobsSchema } from '../dto/create-scheduled-jobs.dto';
import { UpdateScheduledJobsSchema } from '../dto/update-scheduled-jobs.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateScheduledJobsSchema,
  update: UpdateScheduledJobsSchema,
};
