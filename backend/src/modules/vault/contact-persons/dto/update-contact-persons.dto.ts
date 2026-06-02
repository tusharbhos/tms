import { z } from 'zod';
import { CreateContactPersonsSchema } from './create-contact-persons.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateContactPersonsSchema = CreateContactPersonsSchema.partial();
export type UpdateContactPersonsDto = z.infer<typeof UpdateContactPersonsSchema>;
