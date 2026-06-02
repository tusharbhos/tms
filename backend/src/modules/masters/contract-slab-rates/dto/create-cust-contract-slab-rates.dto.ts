import { z } from 'zod';

// CREATE DTO for cust_contract_slab_rates — validated business fields only.
export const CreateCustContractSlabRatesSchema = z.object({
  custContractId: z.number(),
  ctrNum: z.string().optional().nullable(),
  zone: z.string().optional().nullable(),
  fromPlaceId: z.number(),
  fromPlace: z.string().optional().nullable(),
  toPlaceId: z.number(),
  toPlace: z.string().optional().nullable(),
  tat: z.number().optional().nullable(),
  slabDistanceType: z.record(z.any()).optional().nullable(),
  slabContractType: z.string().optional().nullable(),
  slab1: z.number().optional().nullable(),
  slab2: z.number().optional().nullable(),
  slab3: z.number().optional().nullable(),
  slab4: z.number().optional().nullable(),
  slab5: z.number().optional().nullable(),
  slab6: z.number().optional().nullable(),
  slab7: z.number().optional().nullable(),
  slab8: z.number().optional().nullable(),
  versionNo: z.number().optional().nullable(),
  isCurrent: z.boolean().optional().nullable(),
  supersededBy: z.number().optional().nullable(),
  approvalStatus: z.string().optional().nullable(),
  approvedBy: z.number().optional().nullable(),
  rejectionReason: z.string().optional().nullable(),
  effectiveFrom: z.coerce.date().optional().nullable(),
  effectiveUntil: z.coerce.date().optional().nullable(),
  changeSummary: z.string().optional().nullable(),
  previousVersionId: z.number(),
  isActive: z.boolean().optional().nullable(),
});

export type CreateCustContractSlabRatesDto = z.infer<typeof CreateCustContractSlabRatesSchema>;