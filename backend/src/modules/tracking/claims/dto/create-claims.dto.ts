import { z } from 'zod';

// CREATE DTO for txn_claims — validated business fields only.
export const CreateClaimsSchema = z.object({
  claimNo: z.string().optional().nullable(),
  incidentId: z.number(),
  lrId: z.number(),
  customerId: z.number(),
  claimReason: z.string().optional().nullable(),
  claimAmount: z.number().optional().nullable(),
  approvedAmount: z.number().optional().nullable(),
  settledAmount: z.number().optional().nullable(),
  claimStatus: z.string().optional().nullable(),
  reviewedBy: z.number().optional().nullable(),
  approvedBy: z.number().optional().nullable(),
  approvedAt: z.coerce.date().optional().nullable(),
  settledAt: z.coerce.date().optional().nullable(),
  rejectionReason: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
});

export type CreateClaimsDto = z.infer<typeof CreateClaimsSchema>;