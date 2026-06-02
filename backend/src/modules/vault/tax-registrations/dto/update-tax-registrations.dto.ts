import { z } from 'zod';
import { CreateTaxRegistrationsSchema } from './create-tax-registrations.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateTaxRegistrationsSchema = CreateTaxRegistrationsSchema.partial();
export type UpdateTaxRegistrationsDto = z.infer<typeof UpdateTaxRegistrationsSchema>;
