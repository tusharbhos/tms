import { z } from 'zod';

// CREATE DTO for document_types — validated business fields only.
export const CreateDocumentTypesSchema = z.object({
  entityType: z.string().optional().nullable(),
  docCode: z.string().optional().nullable(),
  name: z.string(),
  nameReg: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isRequired: z.boolean().optional().nullable(),
  hasExpiry: z.boolean().optional().nullable(),
  reminderDays: z.number().optional().nullable(),
  allowsMultiple: z.boolean().optional().nullable(),
  acceptedFormats: z.string().optional().nullable(),
  maxFileSizeMb: z.number().optional().nullable(),
  sortOrder: z.number().optional().nullable(),
  status: z.string(),
});

export type CreateDocumentTypesDto = z.infer<typeof CreateDocumentTypesSchema>;