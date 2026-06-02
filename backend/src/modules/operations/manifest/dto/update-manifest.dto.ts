import { z } from 'zod';
import { CreateManifestSchema } from './create-manifest.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateManifestSchema = CreateManifestSchema.partial();
export type UpdateManifestDto = z.infer<typeof UpdateManifestSchema>;
