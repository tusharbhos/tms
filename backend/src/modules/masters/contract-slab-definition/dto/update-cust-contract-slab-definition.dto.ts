import { z } from 'zod';
import { CreateCustContractSlabDefinitionSchema } from './create-cust-contract-slab-definition.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateCustContractSlabDefinitionSchema = CreateCustContractSlabDefinitionSchema.partial();
export type UpdateCustContractSlabDefinitionDto = z.infer<typeof UpdateCustContractSlabDefinitionSchema>;
