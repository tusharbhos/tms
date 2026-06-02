import { z } from 'zod';
import { CreateOrganizationsSchema } from './create-organizations.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateOrganizationsSchema = CreateOrganizationsSchema.partial();
export type UpdateOrganizationsDto = z.infer<typeof UpdateOrganizationsSchema>;
