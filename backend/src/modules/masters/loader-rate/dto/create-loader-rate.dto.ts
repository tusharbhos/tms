import { z } from 'zod';

// CREATE DTO for loader_rate — validated business fields only.
export const CreateLoaderRateSchema = z.object({
  contractingOfficeId: z.number(),
  vendorId: z.number(),
  vendorName: z.string().optional().nullable(),
  defaultRateType: z.string().optional().nullable(),
  regPkgRate: z.number().optional().nullable(),
  crossingPkgRate: z.number().optional().nullable(),
  regWeightRate: z.number().optional().nullable(),
  crossingWeightRate: z.number().optional().nullable(),
  monthlySal: z.number().optional().nullable(),
  dailyAllowance: z.number().optional().nullable(),
  dailyWage: z.number().optional().nullable(),
  dailyWagePkgCapping: z.number().optional().nullable(),
  dailyWageWeightCapping: z.number().optional().nullable(),
  overtimeHourlyRate: z.number().optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  active: z.boolean().optional().nullable(),
  status: z.string(),
  note: z.string().optional().nullable(),
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
});

export type CreateLoaderRateDto = z.infer<typeof CreateLoaderRateSchema>;