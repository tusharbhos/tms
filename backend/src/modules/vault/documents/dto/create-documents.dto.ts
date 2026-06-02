import { z } from 'zod';

// CREATE DTO for documents — validated business fields only.
export const CreateDocumentsSchema = z.object({
  entityType: z.string().optional().nullable(),
  entityId: z.number(),
  documentTypeId: z.number(),
  fileName: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  fileSizeKb: z.number().optional().nullable(),
  documentVersion: z.number().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  uploadedBy: z.number().optional().nullable(),
  active: z.boolean().optional().nullable(),
});

export type CreateDocumentsDto = z.infer<typeof CreateDocumentsSchema>;