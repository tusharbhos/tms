import { CreateCustomerInvoiceSchema } from '../dto/create-customer-invoice.dto';
import { UpdateCustomerInvoiceSchema } from '../dto/update-customer-invoice.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateCustomerInvoiceSchema,
  update: UpdateCustomerInvoiceSchema,
};
