import { z } from 'zod';

// CREATE DTO for txn_vendor_voucher — validated business fields only.
export const CreateVendorVoucherSchema = z.object({
  voucherNo: z.string().optional().nullable(),
  companyId: z.number(),
  vendorId: z.number(),
  tripId: z.number(),
  manifestId: z.number(),
  voucherDate: z.coerce.date().optional().nullable(),
  voucherType: z.string().optional().nullable(),
  hireCharges: z.number().optional().nullable(),
  advanceDeduction: z.number().optional().nullable(),
  loadingCharges: z.number().optional().nullable(),
  fuelDeduction: z.number().optional().nullable(),
  penaltyAmount: z.number().optional().nullable(),
  penaltyRemarks: z.string().optional().nullable(),
  otherDeductions: z.number().optional().nullable(),
  grossAmount: z.number().optional().nullable(),
  netAmount: z.number().optional().nullable(),
  gstApplicable: z.boolean().optional().nullable(),
  tdsRate: z.number().optional().nullable(),
  tdsAmount: z.number().optional().nullable(),
  payableAmount: z.number().optional().nullable(),
  paymentMode: z.string().optional().nullable(),
  utrNumber: z.string().optional().nullable(),
  paidAt: z.coerce.date().optional().nullable(),
  voucherStatus: z.string().optional().nullable(),
  approvedBy: z.number().optional().nullable(),
  pdfUrl: z.string().optional().nullable(),
  sapSyncStatus: z.string().optional().nullable(),
  sapDocumentNo: z.string().optional().nullable(),
  sapSyncError: z.string().optional().nullable(),
  sapSyncedAt: z.coerce.date().optional().nullable(),
});

export type CreateVendorVoucherDto = z.infer<typeof CreateVendorVoucherSchema>;