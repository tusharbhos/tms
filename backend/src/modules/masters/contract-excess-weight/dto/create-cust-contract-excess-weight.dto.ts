import { z } from 'zod';

// CREATE DTO for cust_contract_excess_weight — validated business fields only.
export const CreateCustContractExcessWeightSchema = z.object({
  custContractId: z.number(),
  ctrNum: z.string().optional().nullable(),
  lowerLimit: z.number().optional().nullable(),
  upperLimit: z.number().optional().nullable(),
  rate: z.number().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
});

export type CreateCustContractExcessWeightDto = z.infer<typeof CreateCustContractExcessWeightSchema>;