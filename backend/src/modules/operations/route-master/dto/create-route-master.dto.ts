import { z } from 'zod';

// CREATE DTO for txn_route_master — validated business fields only.
export const CreateRouteMasterSchema = z.object({
  companyId: z.number(),
  routeCode: z.string().optional().nullable(),
  routeName: z.string().optional().nullable(),
  routeType: z.string().optional().nullable(),
  originOfficeId: z.number(),
  destOfficeId: z.number(),
  totalStops: z.number().optional().nullable(),
  estDistanceKm: z.number().optional().nullable(),
  estDurationHrs: z.number().optional().nullable(),
  frequency: z.string().optional().nullable(),
  vehicleType: z.string().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
});

export type CreateRouteMasterDto = z.infer<typeof CreateRouteMasterSchema>;