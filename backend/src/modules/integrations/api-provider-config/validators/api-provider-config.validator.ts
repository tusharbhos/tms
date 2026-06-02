import { CreateApiProviderConfigSchema } from '../dto/create-api-provider-config.dto';
import { UpdateApiProviderConfigSchema } from '../dto/update-api-provider-config.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateApiProviderConfigSchema,
  update: UpdateApiProviderConfigSchema,
};
