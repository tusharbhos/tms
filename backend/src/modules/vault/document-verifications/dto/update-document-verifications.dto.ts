import { z } from 'zod';
import { CreateDocumentVerificationsSchema } from './create-document-verifications.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateDocumentVerificationsSchema = CreateDocumentVerificationsSchema.partial();
export type UpdateDocumentVerificationsDto = z.infer<typeof UpdateDocumentVerificationsSchema>;
