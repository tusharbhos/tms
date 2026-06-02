import { z } from 'zod';

// CREATE DTO for txn_lr — validated business fields only.
export const CreateLrSchema = z.object({
  lrNo: z.string().optional().nullable(),
  bookingId: z.number(),
  companyId: z.number(),
  originOfficeId: z.number(),
  destinationOfficeId: z.number(),
  currentOfficeId: z.number(),
  consignorId: z.number(),
  consigneeId: z.number(),
  consignorName: z.string().optional().nullable(),
  consignorAddr: z.string().optional().nullable(),
  consignorGst: z.string().optional().nullable(),
  consigneeName: z.string().optional().nullable(),
  consigneeAddr: z.string().optional().nullable(),
  consigneeGst: z.string().optional().nullable(),
  consigneeMobile: z.string().optional().nullable(),
  totalPackages: z.number().optional().nullable(),
  totalWeightKg: z.number().optional().nullable(),
  chargeableWeight: z.number().optional().nullable(),
  totalCharges: z.number().optional().nullable(),
  paymentType: z.string().optional().nullable(),
  lrStatus: z.string().optional().nullable(),
  currentStatusCode: z.string().optional().nullable(),
  ewaybillNo: z.string().optional().nullable(),
  ewaybillExpiry: z.coerce.date().optional().nullable(),
  podRequired: z.boolean().optional().nullable(),
  podId: z.number(),
  isReturnLr: z.boolean().optional().nullable(),
  originalLrId: z.number(),
  printedAt: z.coerce.date().optional().nullable(),
  printedBy: z.number().optional().nullable(),
  lrSource: z.string().optional().nullable(),
});

export type CreateLrDto = z.infer<typeof CreateLrSchema>;