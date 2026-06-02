import { CreateLoaderExpenseSchema } from '../dto/create-loader-expense.dto';
import { UpdateLoaderExpenseSchema } from '../dto/update-loader-expense.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateLoaderExpenseSchema,
  update: UpdateLoaderExpenseSchema,
};
