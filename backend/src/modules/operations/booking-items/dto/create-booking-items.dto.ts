import { z } from 'zod';

// CREATE DTO for txn_booking_items — validated business fields only.
export const CreateBookingItemsSchema = z.object({
  bookingId: z.number(),
  lrId: z.number(),
  itemSeq: z.number().optional().nullable(),
  invoiceNo: z.string().optional().nullable(),
  invoiceDate: z.coerce.date().optional().nullable(),
  invoiceValue: z.number().optional().nullable(),
  goodsDesc: z.string().optional().nullable(),
  hsnCode: z.string().optional().nullable(),
  numPackages: z.number().optional().nullable(),
  pkgType: z.string().optional().nullable(),
  actualWeight: z.number().optional().nullable(),
  lengthCm: z.number().optional().nullable(),
  widthCm: z.number().optional().nullable(),
  heightCm: z.number().optional().nullable(),
  volWeightKg: z.number().optional().nullable(),
  isDangerous: z.boolean().optional().nullable(),
  barcodeNo: z.string().optional().nullable(),
  pickedQty: z.number().optional().nullable(),
  verifiedQty: z.number().optional().nullable(),
  loadedQty: z.number().optional().nullable(),
  receivedQty: z.number().optional().nullable(),
  deliveredQty: z.number().optional().nullable(),
});

export type CreateBookingItemsDto = z.infer<typeof CreateBookingItemsSchema>;