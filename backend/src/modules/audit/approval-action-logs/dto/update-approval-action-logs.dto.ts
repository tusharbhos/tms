import { z } from 'zod';
import { CreateApprovalActionLogsSchema } from './create-approval-action-logs.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateApprovalActionLogsSchema = CreateApprovalActionLogsSchema.partial();
export type UpdateApprovalActionLogsDto = z.infer<typeof UpdateApprovalActionLogsSchema>;
