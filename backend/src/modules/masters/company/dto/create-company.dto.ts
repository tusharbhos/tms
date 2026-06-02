import { z } from 'zod';

// CREATE DTO for company — validated business fields only.
export const CreateCompanySchema = z.object({
  parentCompanyId: z.number().optional().nullable(),
  code: z.string(),
  name: z.string(),
  nameReg: z.string().optional().nullable(),
  phone1: z.string().optional().nullable(),
  phone2: z.string().optional().nullable(),
  email1: z.string().email().optional().nullable(),
  email2: z.string().email().optional().nullable(),
  website: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  addressReg: z.string().optional().nullable(),
  gstNum: z.string().optional().nullable(),
  cinNum: z.string().optional().nullable(),
  panNum: z.string().optional().nullable(),
  tanNum: z.string().optional().nullable(),
  msmeNum: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  organizationId: z.number(),
  legalEntityType: z.string().optional().nullable(),
  registrationNumber: z.string().optional().nullable(),
  active: z.boolean().optional().nullable(),
  seqNum: z.number().optional().nullable(),
});

export type CreateCompanyDto = z.infer<typeof CreateCompanySchema>;