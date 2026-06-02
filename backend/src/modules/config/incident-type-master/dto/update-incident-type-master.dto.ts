import { z } from 'zod';
import { CreateIncidentTypeMasterSchema } from './create-incident-type-master.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateIncidentTypeMasterSchema = CreateIncidentTypeMasterSchema.partial();
export type UpdateIncidentTypeMasterDto = z.infer<typeof UpdateIncidentTypeMasterSchema>;
