import { CreatePrintTemplatesSchema } from '../dto/create-print-templates.dto';
import { UpdatePrintTemplatesSchema } from '../dto/update-print-templates.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreatePrintTemplatesSchema,
  update: UpdatePrintTemplatesSchema,
};
