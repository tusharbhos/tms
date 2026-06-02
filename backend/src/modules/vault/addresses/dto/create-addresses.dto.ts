import { z } from 'zod';

// CREATE DTO for addresses — validated business fields only.
export const CreateAddressesSchema = z.object({
  entityType: z.string().optional().nullable(),
  entityId: z.number(),
  addressType: z.string().optional().nullable(),
  addressLine1: z.string().optional().nullable(),
  addressLine2: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  isPrimary: z.boolean().optional().nullable(),
  geoHierarchyId: z.number(),
  addressReg: z.string().optional().nullable(),
  proofDocUrl: z.string().optional().nullable(),
  status: z.string(),
});

export type CreateAddressesDto = z.infer<typeof CreateAddressesSchema>;