import { z } from 'zod';
import { CreateApprovalRequestsSchema } from './create-approval-requests.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateApprovalRequestsSchema = CreateApprovalRequestsSchema.partial();
export type UpdateApprovalRequestsDto = z.infer<typeof UpdateApprovalRequestsSchema>;
