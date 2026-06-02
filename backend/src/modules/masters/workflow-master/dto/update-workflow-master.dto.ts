import { z } from 'zod';
import { CreateWorkflowMasterSchema } from './create-workflow-master.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateWorkflowMasterSchema = CreateWorkflowMasterSchema.partial();
export type UpdateWorkflowMasterDto = z.infer<typeof UpdateWorkflowMasterSchema>;
