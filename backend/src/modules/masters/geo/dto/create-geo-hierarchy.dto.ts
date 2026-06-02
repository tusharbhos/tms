import { z } from 'zod';

// CREATE DTO for geo_hierarchy — validated business fields only.
export const CreateGeoHierarchySchema = z.object({
  country: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  zone: z.string().optional().nullable(),
  taluka: z.string().optional().nullable(),
  poName: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  poLat: z.number().optional().nullable(),
  poLong: z.number().optional().nullable(),
  place: z.string().optional().nullable(),
  placeLat: z.number().optional().nullable(),
  placeLong: z.number().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
});

export type CreateGeoHierarchyDto = z.infer<typeof CreateGeoHierarchySchema>;