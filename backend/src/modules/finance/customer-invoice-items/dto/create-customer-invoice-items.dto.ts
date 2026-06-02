import { z } from 'zod';

// CREATE DTO for txn_customer_invoice_items — validated business fields only.
export const CreateCustomerInvoiceItemsSchema = z.object({
  invoiceId: z.number(),
  lrId: z.number(),
  podId: z.number(),
  lrNo: z.string().optional().nullable(),
  lrDate: z.coerce.date().optional().nullable(),
  fromPlace: z.string().optional().nullable(),
  toPlace: z.string().optional().nullable(),
  numPackages: z.number().optional().nullable(),
  weightKg: z.number().optional().nullable(),
  freightCharges: z.number().optional().nullable(),
  otherCharges: z.number().optional().nullable(),
  totalCharges: z.number().optional().nullable(),
  sgstRate: z.number().optional().nullable(),
  cgstRate: z.number().optional().nullable(),
  igstRate: z.number().optional().nullable(),
  sgstAmount: z.number().optional().nullable(),
  cgstAmount: z.number().optional().nullable(),
  igstAmount: z.number().optional().nullable(),
  lineTotal: z.number().optional().nullable(),
});

export type CreateCustomerInvoiceItemsDto = z.infer<typeof CreateCustomerInvoiceItemsSchema>;