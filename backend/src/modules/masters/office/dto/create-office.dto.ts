import { z } from 'zod';

// CREATE DTO for office — validated business fields only.
export const CreateOfficeSchema = z.object({
  companyTag: z.number().optional().nullable(),
  parentOfficeId: z.number().optional().nullable(),
  code: z.string(),
  name: z.string(),
  nameReg: z.string().optional().nullable(),
  oType: z.string().optional().nullable(),
  officeLevel: z.number().optional().nullable(),
  gstNum: z.string().optional().nullable(),
  cinNum: z.string().optional().nullable(),
  owned: z.boolean().optional().nullable(),
  cpKycId: z.number(),
  country: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  taluka: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  addressReg: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  geoZoneId: z.number(),
  capacityPackages: z.number().optional().nullable(),
  active: z.boolean().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type CreateOfficeDto = z.infer<typeof CreateOfficeSchema>;