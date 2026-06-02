import { z } from 'zod';
import { CreateIncidentsSchema } from './create-incidents.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateIncidentsSchema = CreateIncidentsSchema.partial();
export type UpdateIncidentsDto = z.infer<typeof UpdateIncidentsSchema>;
