import { CreateApprovalStepsSchema } from '../dto/create-approval-steps.dto';
import { UpdateApprovalStepsSchema } from '../dto/update-approval-steps.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateApprovalStepsSchema,
  update: UpdateApprovalStepsSchema,
};
