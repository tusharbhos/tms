import { z } from 'zod';
import { CreateClaimsSchema } from './create-claims.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateClaimsSchema = CreateClaimsSchema.partial();
export type UpdateClaimsDto = z.infer<typeof UpdateClaimsSchema>;
