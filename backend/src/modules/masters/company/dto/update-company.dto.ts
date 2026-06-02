import { z } from 'zod';
import { CreateCompanySchema } from './create-company.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateCompanySchema = CreateCompanySchema.partial();
export type UpdateCompanyDto = z.infer<typeof UpdateCompanySchema>;
