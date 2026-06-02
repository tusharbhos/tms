import { z } from 'zod';

// CREATE DTO for txn_drs_lrs — validated business fields only.
export const CreateDrsLrsSchema = z.object({
  drsId: z.number(),
  lrId: z.number(),
  tripLrId: z.number(),
  seqNo: z.number().optional().nullable(),
  consigneeName: z.string().optional().nullable(),
  consigneeMobile: z.string().optional().nullable(),
  deliveryAddr: z.string().optional().nullable(),
  numPackages: z.number().optional().nullable(),
  topayAmount: z.number().optional().nullable(),
  codAmount: z.number().optional().nullable(),
  delStatus: z.string().optional().nullable(),
  podId: z.number(),
  failReasonId: z.number(),
  reattemptDate: z.coerce.date().optional().nullable(),
  attemptNo: z.number().optional().nullable(),
  otpRequired: z.boolean().optional().nullable(),
  otpVerified: z.boolean().optional().nullable(),
  receiverOtp: z.string().optional().nullable(),
  deliveryLatitude: z.number().optional().nullable(),
  deliveryLongitude: z.number().optional().nullable(),
  deliveryPhotoUrl: z.string().optional().nullable(),
});

export type CreateDrsLrsDto = z.infer<typeof CreateDrsLrsSchema>;