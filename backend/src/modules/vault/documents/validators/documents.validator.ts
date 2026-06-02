import { CreateDocumentsSchema } from '../dto/create-documents.dto';
import { UpdateDocumentsSchema } from '../dto/update-documents.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateDocumentsSchema,
  update: UpdateDocumentsSchema,
};
