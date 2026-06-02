import { z } from 'zod';

// CREATE DTO for txn_prn_lrs — validated business fields only.
export const CreatePrnLrsSchema = z.object({
  prnId: z.number(),
  lrId: z.number(),
  bookingId: z.number(),
  seqNo: z.number().optional().nullable(),
  pickupAddress: z.string().optional().nullable(),
  pickupLat: z.number().optional().nullable(),
  pickupLng: z.number().optional().nullable(),
  numPackages: z.number().optional().nullable(),
  pickupStatus: z.string().optional().nullable(),
  actualPackages: z.number().optional().nullable(),
  pickupTime: z.coerce.date().optional().nullable(),
  pickupLatActual: z.number().optional().nullable(),
  pickupLngActual: z.number().optional().nullable(),
  pickupPhotoUrl: z.string().optional().nullable(),
  failReason: z.string().optional().nullable(),
});

export type CreatePrnLrsDto = z.infer<typeof CreatePrnLrsSchema>;