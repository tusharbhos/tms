import { z } from 'zod';
import { CreateDepartmentsSchema } from './create-departments.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateDepartmentsSchema = CreateDepartmentsSchema.partial();
export type UpdateDepartmentsDto = z.infer<typeof UpdateDepartmentsSchema>;
