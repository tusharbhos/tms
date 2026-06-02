import { z } from 'zod';

// CREATE DTO for txn_pod — validated business fields only.
export const CreatePodSchema = z.object({
  lrId: z.number(),
  drsId: z.number(),
  drsLrId: z.number(),
  podType: z.string().optional().nullable(),
  receiverName: z.string().optional().nullable(),
  receiverMobile: z.string().optional().nullable(),
  receiverRelation: z.string().optional().nullable(),
  signatureUrl: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  stampUrl: z.string().optional().nullable(),
  geoLatitude: z.number().optional().nullable(),
  geoLongitude: z.number().optional().nullable(),
  deliveryTime: z.coerce.date().optional().nullable(),
  numPackagesDel: z.number().optional().nullable(),
  damageStatus: z.string().optional().nullable(),
  shortageQty: z.number().optional().nullable(),
  excessQty: z.number().optional().nullable(),
  remarks: z.string().optional().nullable(),
  topayCollected: z.number().optional().nullable(),
  codCollected: z.number().optional().nullable(),
  verified: z.boolean().optional().nullable(),
  verifiedBy: z.number().optional().nullable(),
  verifiedAt: z.coerce.date().optional().nullable(),
  invoiceTriggered: z.boolean().optional().nullable(),
  otpVerified: z.boolean().optional().nullable(),
  podVerificationStatus: z.string().optional().nullable(),
  podRejectReasonId: z.number(),
});

export type CreatePodDto = z.infer<typeof CreatePodSchema>;