import { z } from 'zod';
import { CreateStatusMasterSchema } from './create-status-master.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateStatusMasterSchema = CreateStatusMasterSchema.partial();
export type UpdateStatusMasterDto = z.infer<typeof UpdateStatusMasterSchema>;
