import { CreateDocumentVerificationsSchema } from '../dto/create-document-verifications.dto';
import { UpdateDocumentVerificationsSchema } from '../dto/update-document-verifications.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateDocumentVerificationsSchema,
  update: UpdateDocumentVerificationsSchema,
};
