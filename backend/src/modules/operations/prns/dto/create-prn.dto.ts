import { z } from 'zod';

// CREATE DTO for txn_prn — validated business fields only.
export const CreatePrnSchema = z.object({
  prnNo: z.string().optional().nullable(),
  officeId: z.number(),
  prnDate: z.coerce.date().optional().nullable(),
  driverId: z.number(),
  vehicleId: z.number(),
  vehicleNo: z.string().optional().nullable(),
  driverName: z.string().optional().nullable(),
  driverMobile: z.string().optional().nullable(),
  routeStartLat: z.number().optional().nullable(),
  routeStartLng: z.number().optional().nullable(),
  numPickups: z.number().optional().nullable(),
  totalPackages: z.number().optional().nullable(),
  estimatedKm: z.number().optional().nullable(),
  prnStatus: z.string().optional().nullable(),
  startTime: z.coerce.date().optional().nullable(),
  endTime: z.coerce.date().optional().nullable(),
  remarks: z.string().optional().nullable(),
});

export type CreatePrnDto = z.infer<typeof CreatePrnSchema>;