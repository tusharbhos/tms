import { z } from 'zod';

// CREATE DTO for txn_trip_lrs — validated business fields only.
export const CreateTripLrsSchema = z.object({
  tripId: z.number(),
  lrId: z.number(),
  stopSeq: z.number().optional().nullable(),
  deliveryAddress: z.string().optional().nullable(),
  delLat: z.number().optional().nullable(),
  delLng: z.number().optional().nullable(),
  numPackages: z.number().optional().nullable(),
  status: z.string(),
  failReasonId: z.number(),
  deliveryTime: z.coerce.date().optional().nullable(),
  codAmount: z.number().optional().nullable(),
  codCollected: z.number().optional().nullable(),
});

export type CreateTripLrsDto = z.infer<typeof CreateTripLrsSchema>;