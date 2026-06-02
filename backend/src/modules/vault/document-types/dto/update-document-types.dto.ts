import { z } from 'zod';
import { CreateDocumentTypesSchema } from './create-document-types.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateDocumentTypesSchema = CreateDocumentTypesSchema.partial();
export type UpdateDocumentTypesDto = z.infer<typeof UpdateDocumentTypesSchema>;
