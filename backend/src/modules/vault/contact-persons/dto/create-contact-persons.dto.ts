import { z } from 'zod';

// CREATE DTO for contact_persons — validated business fields only.
export const CreateContactPersonsSchema = z.object({
  entityType: z.string().optional().nullable(),
  entityId: z.number(),
  contactType: z.string().optional().nullable(),
  salutation: z.string().optional().nullable(),
  name: z.string(),
  designation: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  mobile: z.string(),
  mobile2: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  email2: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  isPrimary: z.boolean().optional().nullable(),
  receivesInvoice: z.boolean().optional().nullable(),
  receivesAlerts: z.boolean().optional().nullable(),
  canLogin: z.boolean().optional().nullable(),
  userId: z.number(),
  notes: z.string().optional().nullable(),
  status: z.string(),
});

export type CreateContactPersonsDto = z.infer<typeof CreateContactPersonsSchema>;