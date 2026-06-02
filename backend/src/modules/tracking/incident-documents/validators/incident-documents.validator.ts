import { CreateIncidentDocumentsSchema } from '../dto/create-incident-documents.dto';
import { UpdateIncidentDocumentsSchema } from '../dto/update-incident-documents.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateIncidentDocumentsSchema,
  update: UpdateIncidentDocumentsSchema,
};
