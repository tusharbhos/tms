import { CreateManifestLrsSchema } from '../dto/create-manifest-lrs.dto';
import { UpdateManifestLrsSchema } from '../dto/update-manifest-lrs.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateManifestLrsSchema,
  update: UpdateManifestLrsSchema,
};
