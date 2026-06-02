import { z } from 'zod';

// CREATE DTO for number_series_config — validated business fields only.
export const CreateNumberSeriesConfigSchema = z.object({
  companyId: z.number(),
  entityType: z.string().optional().nullable(),
  prefix: z.string().optional().nullable(),
  financialYear: z.string().optional().nullable(),
  currentRunningNo: z.number().optional().nullable(),
  minDigits: z.number().optional().nullable(),
  suffix: z.string().optional().nullable(),
  separator: z.string().optional().nullable(),
  resetType: z.string().optional().nullable(),
  lastResetAt: z.coerce.date().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  exampleOutput: z.string().optional().nullable(),
});

export type CreateNumberSeriesConfigDto = z.infer<typeof CreateNumberSeriesConfigSchema>;