import { z } from 'zod';
import { CreateManifestLrsSchema } from './create-manifest-lrs.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateManifestLrsSchema = CreateManifestLrsSchema.partial();
export type UpdateManifestLrsDto = z.infer<typeof UpdateManifestLrsSchema>;
