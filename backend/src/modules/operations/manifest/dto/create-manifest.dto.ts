import { z } from 'zod';

// CREATE DTO for txn_manifest — validated business fields only.
export const CreateManifestSchema = z.object({
  manifestNo: z.string().optional().nullable(),
  companyId: z.number(),
  originOfficeId: z.number(),
  destinationOfficeId: z.number(),
  manifestDate: z.coerce.date().optional().nullable(),
  vendorId: z.number(),
  vehicleId: z.number(),
  vehicleNo: z.string().optional().nullable(),
  driverId: z.number(),
  driverName: z.string().optional().nullable(),
  driverMobile: z.string().optional().nullable(),
  numLrs: z.number().optional().nullable(),
  totalPackages: z.number().optional().nullable(),
  totalWeightKg: z.number().optional().nullable(),
  tripId: z.number(),
  consolidatedEwbNo: z.string().optional().nullable(),
  estimatedKm: z.number().optional().nullable(),
  freightCharges: z.number().optional().nullable(),
  loadingCharges: z.number().optional().nullable(),
  advancePaid: z.number().optional().nullable(),
  manifestStatus: z.string().optional().nullable(),
  dispatchedAt: z.coerce.date().optional().nullable(),
  arrivedAt: z.coerce.date().optional().nullable(),
  meterStart: z.number().optional().nullable(),
  meterEnd: z.number().optional().nullable(),
  podReceivedBy: z.number().optional().nullable(),
  cancelReasonId: z.number(),
});

export type CreateManifestDto = z.infer<typeof CreateManifestSchema>;