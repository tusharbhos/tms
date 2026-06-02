import { z } from 'zod';
import { CreateCustomerInvoiceItemsSchema } from './create-customer-invoice-items.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateCustomerInvoiceItemsSchema = CreateCustomerInvoiceItemsSchema.partial();
export type UpdateCustomerInvoiceItemsDto = z.infer<typeof UpdateCustomerInvoiceItemsSchema>;
