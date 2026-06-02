import { z } from 'zod';

// CREATE DTO for txn_vehicle_location_logs — validated business fields only.
export const CreateVehicleLocationLogsSchema = z.object({
  tripId: z.number(),
  vehicleId: z.number(),
  driverId: z.number(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  speedKmph: z.number().optional().nullable(),
  headingDeg: z.number().optional().nullable(),
  accuracyM: z.number().optional().nullable(),
  source: z.string().optional().nullable(),
  loggedAt: z.coerce.date().optional().nullable(),
});

export type CreateVehicleLocationLogsDto = z.infer<typeof CreateVehicleLocationLogsSchema>;