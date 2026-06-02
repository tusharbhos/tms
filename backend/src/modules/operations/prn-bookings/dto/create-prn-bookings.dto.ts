import { z } from 'zod';

// CREATE DTO for txn_prn_bookings — validated business fields only.
export const CreatePrnBookingsSchema = z.object({
  prnId: z.number(),
  bookingId: z.number(),
  seqNo: z.number().optional().nullable(),
  consignorName: z.string().optional().nullable(),
  consignorMobile: z.string().optional().nullable(),
  pickupAddress: z.string().optional().nullable(),
  pickupLatitude: z.number().optional().nullable(),
  pickupLongitude: z.number().optional().nullable(),
  declaredPackages: z.number().optional().nullable(),
  declaredWeightKg: z.number().optional().nullable(),
  pickupStatus: z.string().optional().nullable(),
  packagesPicked: z.number().optional().nullable(),
  actualWeightKg: z.number().optional().nullable(),
  weightVariancePct: z.number().optional().nullable(),
  pickupPhotoUrl: z.string().optional().nullable(),
  pickupTime: z.coerce.date().optional().nullable(),
  lrId: z.number(),
  lrGeneratedAt: z.coerce.date().optional().nullable(),
  failReasonId: z.number(),
  remarks: z.string().optional().nullable(),
});

export type CreatePrnBookingsDto = z.infer<typeof CreatePrnBookingsSchema>;
