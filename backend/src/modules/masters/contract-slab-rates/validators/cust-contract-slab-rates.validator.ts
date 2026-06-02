import { CreateCustContractSlabRatesSchema } from '../dto/create-cust-contract-slab-rates.dto';
import { UpdateCustContractSlabRatesSchema } from '../dto/update-cust-contract-slab-rates.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateCustContractSlabRatesSchema,
  update: UpdateCustContractSlabRatesSchema,
};
