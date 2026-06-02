import { z } from 'zod';
import { CreateTripExpensesSchema } from './create-trip-expenses.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateTripExpensesSchema = CreateTripExpensesSchema.partial();
export type UpdateTripExpensesDto = z.infer<typeof UpdateTripExpensesSchema>;
