import { z } from 'zod';

// CREATE DTO for cust_contract_oda_charges — validated business fields only.
export const CreateCustContractOdaChargesSchema = z.object({
  custContractId: z.number(),
  ctrNum: z.string().optional().nullable(),
  fromPlaceId: z.number(),
  fromPlace: z.string().optional().nullable(),
  toPlaceId: z.number(),
  toPlace: z.string().optional().nullable(),
  rate: z.number().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
});

export type CreateCustContractOdaChargesDto = z.infer<typeof CreateCustContractOdaChargesSchema>;