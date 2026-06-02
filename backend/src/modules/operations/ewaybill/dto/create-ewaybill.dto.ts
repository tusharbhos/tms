import { z } from 'zod';

// CREATE DTO for txn_ewaybill — validated business fields only.
export const CreateEwaybillSchema = z.object({
  lrId: z.number(),
  bookingId: z.number(),
  ewbNo: z.string().optional().nullable(),
  ewbDate: z.coerce.date().optional().nullable(),
  ewbValidTill: z.coerce.date().optional().nullable(),
  ewbType: z.string().optional().nullable(),
  supplyType: z.string().optional().nullable(),
  gstinSupplier: z.string().optional().nullable(),
  gstinRecipient: z.string().optional().nullable(),
  placeOfSupply: z.string().optional().nullable(),
  totalValue: z.number().optional().nullable(),
  hsnCode: z.string().optional().nullable(),
  transporterId: z.string(),
  vehicleNo: z.string().optional().nullable(),
  vehicleType: z.string().optional().nullable(),
  ewbStatus: z.string().optional().nullable(),
  generationMode: z.string().optional().nullable(),
  cancelReason: z.string().optional().nullable(),
  apiRequestJson: z.record(z.any()).optional().nullable(),
  apiResponseJson: z.record(z.any()).optional().nullable(),
  consolidatedEwbNo: z.string().optional().nullable(),
});

export type CreateEwaybillDto = z.infer<typeof CreateEwaybillSchema>;