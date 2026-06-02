import { z } from 'zod';
import { CreateGeoHierarchySchema } from './create-geo-hierarchy.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateGeoHierarchySchema = CreateGeoHierarchySchema.partial();
export type UpdateGeoHierarchyDto = z.infer<typeof UpdateGeoHierarchySchema>;
