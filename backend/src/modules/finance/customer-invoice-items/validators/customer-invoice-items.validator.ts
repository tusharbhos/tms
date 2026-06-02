import { CreateCustomerInvoiceItemsSchema } from '../dto/create-customer-invoice-items.dto';
import { UpdateCustomerInvoiceItemsSchema } from '../dto/update-customer-invoice-items.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateCustomerInvoiceItemsSchema,
  update: UpdateCustomerInvoiceItemsSchema,
};
