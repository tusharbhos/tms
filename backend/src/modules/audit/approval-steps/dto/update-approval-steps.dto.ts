import { z } from 'zod';
import { CreateApprovalStepsSchema } from './create-approval-steps.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateApprovalStepsSchema = CreateApprovalStepsSchema.partial();
export type UpdateApprovalStepsDto = z.infer<typeof UpdateApprovalStepsSchema>;
