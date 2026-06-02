import { CreateStatusMasterSchema } from '../dto/create-status-master.dto';
import { UpdateStatusMasterSchema } from '../dto/update-status-master.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateStatusMasterSchema,
  update: UpdateStatusMasterSchema,
};
