import { CreateCustContractOdaChargesSchema } from '../dto/create-cust-contract-oda-charges.dto';
import { UpdateCustContractOdaChargesSchema } from '../dto/update-cust-contract-oda-charges.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateCustContractOdaChargesSchema,
  update: UpdateCustContractOdaChargesSchema,
};
