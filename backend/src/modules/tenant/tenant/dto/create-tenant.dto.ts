import { z } from 'zod';

// CREATE DTO for tenant — validated business fields only.
export const CreateTenantSchema = z.object({
  name: z.string(),
  code: z.string(),
  timezone: z.string().optional().nullable(),
  languageCode: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  currencyId: z.number(),
  active: z.boolean().optional().nullable(),
  status: z.string(),
});

export type CreateTenantDto = z.infer<typeof CreateTenantSchema>;