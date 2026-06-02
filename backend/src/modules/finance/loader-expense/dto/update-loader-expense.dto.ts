import { z } from 'zod';
import { CreateLoaderExpenseSchema } from './create-loader-expense.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateLoaderExpenseSchema = CreateLoaderExpenseSchema.partial();
export type UpdateLoaderExpenseDto = z.infer<typeof UpdateLoaderExpenseSchema>;
