import { CreateCustContractSchema } from '../dto/create-cust-contract.dto';
import { UpdateCustContractSchema } from '../dto/update-cust-contract.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateCustContractSchema,
  update: UpdateCustContractSchema,
};
