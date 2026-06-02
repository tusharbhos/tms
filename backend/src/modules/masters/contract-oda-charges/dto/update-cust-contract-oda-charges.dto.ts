import { z } from 'zod';
import { CreateCustContractOdaChargesSchema } from './create-cust-contract-oda-charges.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateCustContractOdaChargesSchema = CreateCustContractOdaChargesSchema.partial();
export type UpdateCustContractOdaChargesDto = z.infer<typeof UpdateCustContractOdaChargesSchema>;
