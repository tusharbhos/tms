import { z } from 'zod';
import { CreateBankAccountsSchema } from './create-bank-accounts.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateBankAccountsSchema = CreateBankAccountsSchema.partial();
export type UpdateBankAccountsDto = z.infer<typeof UpdateBankAccountsSchema>;
