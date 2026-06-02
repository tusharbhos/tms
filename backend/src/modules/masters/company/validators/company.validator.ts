import { CreateCompanySchema } from '../dto/create-company.dto';
import { UpdateCompanySchema } from '../dto/update-company.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateCompanySchema,
  update: UpdateCompanySchema,
};
