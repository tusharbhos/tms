import { z } from 'zod';
import { CreateCustContractExcessWeightSchema } from './create-cust-contract-excess-weight.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateCustContractExcessWeightSchema = CreateCustContractExcessWeightSchema.partial();
export type UpdateCustContractExcessWeightDto = z.infer<typeof UpdateCustContractExcessWeightSchema>;
