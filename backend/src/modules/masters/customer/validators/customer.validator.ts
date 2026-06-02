import { CreateCustomerSchema } from '../dto/create-customer.dto';
import { UpdateCustomerSchema } from '../dto/update-customer.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateCustomerSchema,
  update: UpdateCustomerSchema,
};
