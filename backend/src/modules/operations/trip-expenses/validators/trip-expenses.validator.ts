import { CreateTripExpensesSchema } from '../dto/create-trip-expenses.dto';
import { UpdateTripExpensesSchema } from '../dto/update-trip-expenses.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateTripExpensesSchema,
  update: UpdateTripExpensesSchema,
};
