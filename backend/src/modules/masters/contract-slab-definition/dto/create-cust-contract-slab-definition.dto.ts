import { z } from 'zod';

// CREATE DTO for cust_contract_slab_definition — validated business fields only.
export const CreateCustContractSlabDefinitionSchema = z.object({
  custContractId: z.number(),
  ctrNum: z.string().optional().nullable(),
  slabDistanceType: z.record(z.any()).optional().nullable(),
  slabContractType: z.string().optional().nullable(),
  slabRateType: z.string().optional().nullable(),
  slabNumber: z.string().optional().nullable(),
  slabLowerLimit: z.number().optional().nullable(),
  slabUpperLimit: z.number().optional().nullable(),
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

export type CreateCustContractSlabDefinitionDto = z.infer<typeof CreateCustContractSlabDefinitionSchema>;