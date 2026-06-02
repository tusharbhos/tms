import { CreateReasonMasterSchema } from '../dto/create-reason-master.dto';
import { UpdateReasonMasterSchema } from '../dto/update-reason-master.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateReasonMasterSchema,
  update: UpdateReasonMasterSchema,
};
