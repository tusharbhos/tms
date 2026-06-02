import { z } from 'zod';

// CREATE DTO for document_verifications — validated business fields only.
export const CreateDocumentVerificationsSchema = z.object({
  documentId: z.number(),
  documentTypeId: z.number(),
  entityType: z.string().optional().nullable(),
  entityId: z.number(),
  action: z.string().optional().nullable(),
  actionBy: z.number().optional().nullable(),
  actionAt: z.coerce.date().optional().nullable(),
  remarks: z.string().optional().nullable(),
  previousStatus: z.string().optional().nullable(),
  newStatus: z.string().optional().nullable(),
  docUrlSnapshot: z.string().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  verificationMethod: z.string().optional().nullable(),
  ipAddress: z.string().optional().nullable(),
  approvalRequestId: z.number(),
});

export type CreateDocumentVerificationsDto = z.infer<typeof CreateDocumentVerificationsSchema>;