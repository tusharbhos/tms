import { z } from 'zod';

// CREATE DTO for tax_registrations — validated business fields only.
export const CreateTaxRegistrationsSchema = z.object({
  entityType: z.string().optional().nullable(),
  entityId: z.number(),
  regType: z.string().optional().nullable(),
  regNumber: z.string().optional().nullable(),
  regName: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  regDate: z.coerce.date().optional().nullable(),
  expiryDate: z.coerce.date().optional().nullable(),
  docUrl: z.string().optional().nullable(),
  docTypeId: z.number(),
  isPrimary: z.boolean().optional().nullable(),
  verificationStatus: z.string().optional().nullable(),
  verifiedAt: z.coerce.date().optional().nullable(),
  verifiedBy: z.number().optional().nullable(),
  rejectionReason: z.string().optional().nullable(),
  reminderDays: z.number().optional().nullable(),
  status: z.string(),
});

export type CreateTaxRegistrationsDto = z.infer<typeof CreateTaxRegistrationsSchema>;