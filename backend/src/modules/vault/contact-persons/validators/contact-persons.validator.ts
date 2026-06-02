import { CreateContactPersonsSchema } from '../dto/create-contact-persons.dto';
import { UpdateContactPersonsSchema } from '../dto/update-contact-persons.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateContactPersonsSchema,
  update: UpdateContactPersonsSchema,
};
