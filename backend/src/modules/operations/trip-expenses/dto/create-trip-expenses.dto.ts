import { z } from 'zod';

// CREATE DTO for txn_trip_expenses — validated business fields only.
export const CreateTripExpensesSchema = z.object({
  tripId: z.number(),
  driverId: z.number(),
  expenseType: z.string().optional().nullable(),
  expenseSubtype: z.string().optional().nullable(),
  amount: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  paymentMode: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  receiptUrl: z.string().optional().nullable(),
  expenseTime: z.coerce.date().optional().nullable(),
  status: z.string(),
  approvedBy: z.number().optional().nullable(),
  approvedAt: z.coerce.date().optional().nullable(),
  rejectReason: z.string().optional().nullable(),
  sapExpenseId: z.string(),
});

export type CreateTripExpensesDto = z.infer<typeof CreateTripExpensesSchema>;