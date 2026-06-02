import { CreateNumberSeriesConfigSchema } from '../dto/create-number-series-config.dto';
import { UpdateNumberSeriesConfigSchema } from '../dto/update-number-series-config.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateNumberSeriesConfigSchema,
  update: UpdateNumberSeriesConfigSchema,
};
