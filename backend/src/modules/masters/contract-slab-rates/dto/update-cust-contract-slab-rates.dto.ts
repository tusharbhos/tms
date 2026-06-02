import { z } from 'zod';
import { CreateCustContractSlabRatesSchema } from './create-cust-contract-slab-rates.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateCustContractSlabRatesSchema = CreateCustContractSlabRatesSchema.partial();
export type UpdateCustContractSlabRatesDto = z.infer<typeof UpdateCustContractSlabRatesSchema>;
