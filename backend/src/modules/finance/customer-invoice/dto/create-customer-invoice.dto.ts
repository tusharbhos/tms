import { z } from 'zod';

// CREATE DTO for txn_customer_invoice — validated business fields only.
export const CreateCustomerInvoiceSchema = z.object({
  invoiceNo: z.string().optional().nullable(),
  companyId: z.number(),
  billingOfficeId: z.number(),
  customerId: z.number(),
  invoiceType: z.string().optional().nullable(),
  invoiceDate: z.coerce.date().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
  periodFrom: z.coerce.date().optional().nullable(),
  periodTo: z.coerce.date().optional().nullable(),
  numLrs: z.number().optional().nullable(),
  subTotal: z.number().optional().nullable(),
  totalSgst: z.number().optional().nullable(),
  totalCgst: z.number().optional().nullable(),
  totalIgst: z.number().optional().nullable(),
  grandTotal: z.number().optional().nullable(),
  tdsRate: z.number().optional().nullable(),
  tdsAmount: z.number().optional().nullable(),
  invoiceStatus: z.string().optional().nullable(),
  paymentReceived: z.number().optional().nullable(),
  pdfUrl: z.string().optional().nullable(),
  emailSentAt: z.coerce.date().optional().nullable(),
  isGstInvoice: z.boolean().optional().nullable(),
  referenceInvoiceId: z.number(),
  sapSyncStatus: z.string().optional().nullable(),
  sapDocumentNo: z.string().optional().nullable(),
  sapSyncError: z.string().optional().nullable(),
  sapSyncedAt: z.coerce.date().optional().nullable(),
});

export type CreateCustomerInvoiceDto = z.infer<typeof CreateCustomerInvoiceSchema>;