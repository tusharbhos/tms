import { z } from 'zod';

// CREATE DTO for txn_route_stops — validated business fields only.
export const CreateRouteStopsSchema = z.object({
  routeId: z.number(),
  stopSequence: z.number().optional().nullable(),
  officeId: z.number(),
  stopType: z.number().optional().nullable(),
  estDistanceKm: z.number().optional().nullable(),
  estDurationHrs: z.number().optional().nullable(),
  loadingAllowed: z.boolean().optional().nullable(),
  unloadingAllowed: z.boolean().optional().nullable(),
});

export type CreateRouteStopsDto = z.infer<typeof CreateRouteStopsSchema>;