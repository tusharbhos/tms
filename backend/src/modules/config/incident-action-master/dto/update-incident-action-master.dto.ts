import { z } from 'zod';
import { CreateIncidentActionMasterSchema } from './create-incident-action-master.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateIncidentActionMasterSchema = CreateIncidentActionMasterSchema.partial();
export type UpdateIncidentActionMasterDto = z.infer<typeof UpdateIncidentActionMasterSchema>;
