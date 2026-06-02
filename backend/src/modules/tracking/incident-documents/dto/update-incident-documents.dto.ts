import { z } from 'zod';
import { CreateIncidentDocumentsSchema } from './create-incident-documents.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateIncidentDocumentsSchema = CreateIncidentDocumentsSchema.partial();
export type UpdateIncidentDocumentsDto = z.infer<typeof UpdateIncidentDocumentsSchema>;
