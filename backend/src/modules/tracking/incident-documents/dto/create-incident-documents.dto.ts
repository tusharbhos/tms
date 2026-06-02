import { z } from 'zod';

// CREATE DTO for txn_incident_documents — validated business fields only.
export const CreateIncidentDocumentsSchema = z.object({
  incidentId: z.number(),
  documentType: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  fileName: z.string().optional().nullable(),
  fileSizeKb: z.number().optional().nullable(),
  remarks: z.string().optional().nullable(),
  uploadedBy: z.number().optional().nullable(),
  uploadedAt: z.coerce.date().optional().nullable(),
  verifiedBy: z.number().optional().nullable(),
  verifiedAt: z.coerce.date().optional().nullable(),
});

export type CreateIncidentDocumentsDto = z.infer<typeof CreateIncidentDocumentsSchema>;