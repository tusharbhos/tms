import { CreateDocumentTypesSchema } from '../dto/create-document-types.dto';
import { UpdateDocumentTypesSchema } from '../dto/update-document-types.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateDocumentTypesSchema,
  update: UpdateDocumentTypesSchema,
};
