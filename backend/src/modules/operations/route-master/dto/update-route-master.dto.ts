import { z } from 'zod';
import { CreateRouteMasterSchema } from './create-route-master.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateRouteMasterSchema = CreateRouteMasterSchema.partial();
export type UpdateRouteMasterDto = z.infer<typeof UpdateRouteMasterSchema>;
