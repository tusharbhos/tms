import { CreateCustContractSlabDefinitionSchema } from '../dto/create-cust-contract-slab-definition.dto';
import { UpdateCustContractSlabDefinitionSchema } from '../dto/update-cust-contract-slab-definition.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateCustContractSlabDefinitionSchema,
  update: UpdateCustContractSlabDefinitionSchema,
};
