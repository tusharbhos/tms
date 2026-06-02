import { z } from 'zod';

// CREATE DTO for txn_drs — validated business fields only.
export const CreateDrsSchema = z.object({
  drsNo: z.string().optional().nullable(),
  officeId: z.number(),
  drsDate: z.coerce.date().optional().nullable(),
  tripId: z.number(),
  driverId: z.number(),
  vehicleId: z.number(),
  vehicleNo: z.string().optional().nullable(),
  driverMobile: z.string().optional().nullable(),
  numLrs: z.number().optional().nullable(),
  totalPackages: z.number().optional().nullable(),
  drsStatus: z.string().optional().nullable(),
  startTime: z.coerce.date().optional().nullable(),
  endTime: z.coerce.date().optional().nullable(),
  totalCodAmount: z.number().optional().nullable(),
  codCollected: z.number().optional().nullable(),
  cashSubmitted: z.boolean().optional().nullable(),
  estimatedKm: z.number().optional().nullable(),
  remarks: z.string().optional().nullable(),
});

export type CreateDrsDto = z.infer<typeof CreateDrsSchema>;