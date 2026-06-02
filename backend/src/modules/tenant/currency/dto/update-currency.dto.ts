import { z } from 'zod';
import { CreateCurrencySchema } from './create-currency.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateCurrencySchema = CreateCurrencySchema.partial();
export type UpdateCurrencyDto = z.infer<typeof UpdateCurrencySchema>;
