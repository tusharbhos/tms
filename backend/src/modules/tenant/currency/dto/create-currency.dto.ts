import { z } from 'zod';

// CREATE DTO for currency — validated business fields only.
export const CreateCurrencySchema = z.object({
  code: z.string(),
  name: z.string(),
  symbol: z.string().optional().nullable(),
  decimalPlaces: z.number().optional().nullable(),
  symbolPosition: z.string().optional().nullable(),
  thousandsSeparator: z.string().optional().nullable(),
  decimalSeparator: z.string().optional().nullable(),
  active: z.boolean().optional().nullable(),
});

export type CreateCurrencyDto = z.infer<typeof CreateCurrencySchema>;