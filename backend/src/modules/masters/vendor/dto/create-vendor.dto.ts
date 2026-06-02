import { z } from 'zod';

// CREATE DTO for vendor — validated business fields only.
export const CreateVendorSchema = z.object({
  companyTag: z.number().optional().nullable(),
  contractingOfficeId: z.number(),
  code: z.string(),
  name: z.string(),
  nameReg: z.string().optional().nullable(),
  legalName: z.string().optional().nullable(),
  legalNameReg: z.string().optional().nullable(),
  erpCode: z.string().optional().nullable(),
  vType: z.string().optional().nullable(),
  vendorCategory: z.number().optional().nullable(),
  mobile: z.string(),
  email: z.string().email().optional().nullable(),
  vendorRating: z.number().optional().nullable(),
  paymentTerms: z.string().optional().nullable(),
  contractId: z.number(),
  active: z.boolean().optional().nullable(),
  blacklistedFlag: z.boolean().optional().nullable(),
  blacklistReason: z.string().optional().nullable(),
});

export type CreateVendorDto = z.infer<typeof CreateVendorSchema>;