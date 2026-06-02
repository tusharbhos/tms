import { z } from 'zod';
import { CreateDocumentsSchema } from './create-documents.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateDocumentsSchema = CreateDocumentsSchema.partial();
export type UpdateDocumentsDto = z.infer<typeof UpdateDocumentsSchema>;
