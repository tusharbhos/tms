import { z } from 'zod';

// CREATE DTO for txn_booking_charges — validated business fields only.
export const CreateBookingChargesSchema = z.object({
  bookingId: z.number(),
  lrId: z.number(),
  contractId: z.number(),
  rateType: z.string().optional().nullable(),
  freightRatePerKg: z.number().optional().nullable(),
  freightRatePerPkg: z.number().optional().nullable(),
  chargeableWeight: z.number().optional().nullable(),
  freightCharges: z.number().optional().nullable(),
  excessWeightCharges: z.number().optional().nullable(),
  loadingCharges: z.number().optional().nullable(),
  doorDeliveryCharges: z.number().optional().nullable(),
  odaCharges: z.number().optional().nullable(),
  insuranceRatePct: z.number().optional().nullable(),
  insuranceAmount: z.number().optional().nullable(),
  fuelSurcharge: z.number().optional().nullable(),
  codCharges: z.number().optional().nullable(),
  otherCharges: z.number().optional().nullable(),
  otherChargesRemarks: z.string().optional().nullable(),
  subTotal: z.number().optional().nullable(),
  sgstRate: z.number().optional().nullable(),
  cgstRate: z.number().optional().nullable(),
  igstRate: z.number().optional().nullable(),
  sgstAmount: z.number().optional().nullable(),
  cgstAmount: z.number().optional().nullable(),
  igstAmount: z.number().optional().nullable(),
  totalCharges: z.number().optional().nullable(),
  advanceAmount: z.number().optional().nullable(),
  balanceAmount: z.number().optional().nullable(),
  isLocked: z.boolean().optional().nullable(),
});

export type CreateBookingChargesDto = z.infer<typeof CreateBookingChargesSchema>;