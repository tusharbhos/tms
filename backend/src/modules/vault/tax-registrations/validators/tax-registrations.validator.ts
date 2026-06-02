import { CreateTaxRegistrationsSchema } from '../dto/create-tax-registrations.dto';
import { UpdateTaxRegistrationsSchema } from '../dto/update-tax-registrations.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateTaxRegistrationsSchema,
  update: UpdateTaxRegistrationsSchema,
};
