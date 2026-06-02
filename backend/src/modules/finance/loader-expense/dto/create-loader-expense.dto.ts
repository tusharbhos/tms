import { z } from 'zod';

// CREATE DTO for fm_loader_expense — validated business fields only.
export const CreateLoaderExpenseSchema = z.object({
  officeId: z.number(),
  manifestId: z.number(),
  tripId: z.number(),
  expenseDate: z.coerce.date().optional().nullable(),
  loaderType: z.string().optional().nullable(),
  numLoaders: z.number().optional().nullable(),
  numHours: z.number().optional().nullable(),
  numPackages: z.number().optional().nullable(),
  rateType: z.string().optional().nullable(),
  rate: z.number().optional().nullable(),
  totalAmount: z.number().optional().nullable(),
  paidBy: z.string().optional().nullable(),
  paymentRef: z.string().optional().nullable(),
  billUrl: z.string().optional().nullable(),
});

export type CreateLoaderExpenseDto = z.infer<typeof CreateLoaderExpenseSchema>;