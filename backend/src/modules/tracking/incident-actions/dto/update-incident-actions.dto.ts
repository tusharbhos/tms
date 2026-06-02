import { z } from 'zod';
import { CreateIncidentActionsSchema } from './create-incident-actions.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateIncidentActionsSchema = CreateIncidentActionsSchema.partial();
export type UpdateIncidentActionsDto = z.infer<typeof UpdateIncidentActionsSchema>;
