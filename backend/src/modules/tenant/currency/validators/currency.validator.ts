import { CreateCurrencySchema } from '../dto/create-currency.dto';
import { UpdateCurrencySchema } from '../dto/update-currency.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateCurrencySchema,
  update: UpdateCurrencySchema,
};
