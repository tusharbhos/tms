import { CreateApprovalRequestsSchema } from '../dto/create-approval-requests.dto';
import { UpdateApprovalRequestsSchema } from '../dto/update-approval-requests.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateApprovalRequestsSchema,
  update: UpdateApprovalRequestsSchema,
};
