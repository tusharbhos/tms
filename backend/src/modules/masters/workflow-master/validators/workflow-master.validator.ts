import { CreateWorkflowMasterSchema } from '../dto/create-workflow-master.dto';
import { UpdateWorkflowMasterSchema } from '../dto/update-workflow-master.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateWorkflowMasterSchema,
  update: UpdateWorkflowMasterSchema,
};
