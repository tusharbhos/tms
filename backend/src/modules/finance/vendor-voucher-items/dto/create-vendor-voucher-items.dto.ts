import { z } from 'zod';

// CREATE DTO for txn_vendor_voucher_items — validated business fields only.
export const CreateVendorVoucherItemsSchema = z.object({
  voucherId: z.number(),
  lineType: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  amount: z.number().optional().nullable(),
  referenceId: z.number(),
  referenceType: z.string().optional().nullable(),
});

export type CreateVendorVoucherItemsDto = z.infer<typeof CreateVendorVoucherItemsSchema>;