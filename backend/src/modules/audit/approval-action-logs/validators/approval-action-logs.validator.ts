import { CreateApprovalActionLogsSchema } from '../dto/create-approval-action-logs.dto';
import { UpdateApprovalActionLogsSchema } from '../dto/update-approval-action-logs.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateApprovalActionLogsSchema,
  update: UpdateApprovalActionLogsSchema,
};
