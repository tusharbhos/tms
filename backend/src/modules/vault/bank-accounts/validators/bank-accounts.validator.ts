import { CreateBankAccountsSchema } from '../dto/create-bank-accounts.dto';
import { UpdateBankAccountsSchema } from '../dto/update-bank-accounts.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateBankAccountsSchema,
  update: UpdateBankAccountsSchema,
};
