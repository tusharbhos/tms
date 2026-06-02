import { z } from 'zod';

// CREATE DTO for cust_contract — validated business fields only.
export const CreateCustContractSchema = z.object({
  companyTag: z.number().optional().nullable(),
  customerId: z.number(),
  customerGroupId: z.number(),
  ctrNum: z.string().optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  paymentType: z.record(z.any()).optional().nullable(),
  loadType: z.record(z.any()).optional().nullable(),
  distanceType: z.record(z.any()).optional().nullable(),
  rateType: z.record(z.any()).optional().nullable(),
  pickupDeliveryMode: z.record(z.any()).optional().nullable(),
  excessWtChargeable: z.boolean().optional().nullable(),
  odaDelChargeable: z.boolean().optional().nullable(),
  creditPeriod: z.number().optional().nullable(),
  docuChargesPerInvoice: z.number().optional().nullable(),
  loadingChargesPerPkg: z.number().optional().nullable(),
  fuelSurcharge: z.number().optional().nullable(),
  odaMinDelCharges: z.number().optional().nullable(),
  reversePickUpCharges: z.number().optional().nullable(),
  insuranceCharges: z.number().optional().nullable(),
  minimumChargeableWt: z.number().optional().nullable(),
  active: z.boolean().optional().nullable(),
  versionNo: z.number().optional().nullable(),
  isCurrent: z.boolean().optional().nullable(),
  supersededBy: z.number().optional().nullable(),
  approvalStatus: z.string().optional().nullable(),
  rejectionReason: z.string().optional().nullable(),
  effectiveFrom: z.coerce.date().optional().nullable(),
  effectiveUntil: z.coerce.date().optional().nullable(),
  changeSummary: z.string().optional().nullable(),
  previousVersionId: z.number(),
});

export type CreateCustContractDto = z.infer<typeof CreateCustContractSchema>;