import { CreateFeatureFlagsSchema } from '../dto/create-feature-flags.dto';
import { UpdateFeatureFlagsSchema } from '../dto/update-feature-flags.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateFeatureFlagsSchema,
  update: UpdateFeatureFlagsSchema,
};
