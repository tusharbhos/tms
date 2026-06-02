import { CreateCustContractExcessWeightSchema } from '../dto/create-cust-contract-excess-weight.dto';
import { UpdateCustContractExcessWeightSchema } from '../dto/update-cust-contract-excess-weight.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateCustContractExcessWeightSchema,
  update: UpdateCustContractExcessWeightSchema,
};
