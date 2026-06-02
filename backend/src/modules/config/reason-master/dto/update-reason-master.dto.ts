import { z } from 'zod';
import { CreateReasonMasterSchema } from './create-reason-master.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateReasonMasterSchema = CreateReasonMasterSchema.partial();
export type UpdateReasonMasterDto = z.infer<typeof UpdateReasonMasterSchema>;
