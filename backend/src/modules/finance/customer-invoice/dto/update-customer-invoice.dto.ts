import { z } from 'zod';
import { CreateCustomerInvoiceSchema } from './create-customer-invoice.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateCustomerInvoiceSchema = CreateCustomerInvoiceSchema.partial();
export type UpdateCustomerInvoiceDto = z.infer<typeof UpdateCustomerInvoiceSchema>;
