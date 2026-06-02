import { CreateLoaderRateSchema } from '../dto/create-loader-rate.dto';
import { UpdateLoaderRateSchema } from '../dto/update-loader-rate.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateLoaderRateSchema,
  update: UpdateLoaderRateSchema,
};
