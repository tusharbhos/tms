import { z } from 'zod';
import { CreateCustContractSchema } from './create-cust-contract.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateCustContractSchema = CreateCustContractSchema.partial();
export type UpdateCustContractDto = z.infer<typeof UpdateCustContractSchema>;
