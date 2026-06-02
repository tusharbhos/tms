import { CreateApiSyncJobsSchema } from '../dto/create-api-sync-jobs.dto';
import { UpdateApiSyncJobsSchema } from '../dto/update-api-sync-jobs.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateApiSyncJobsSchema,
  update: UpdateApiSyncJobsSchema,
};
