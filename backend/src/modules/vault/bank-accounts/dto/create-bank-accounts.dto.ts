import { z } from 'zod';

// CREATE DTO for bank_accounts — validated business fields only.
export const CreateBankAccountsSchema = z.object({
  entityType: z.string().optional().nullable(),
  entityId: z.number(),
  accountLabel: z.string().optional().nullable(),
  accountHolder: z.string().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  accountType: z.string().optional().nullable(),
  bankName: z.string().optional().nullable(),
  bankCode: z.string().optional().nullable(),
  ifscCode: z.string().optional().nullable(),
  branchName: z.string().optional().nullable(),
  branchAddress: z.string().optional().nullable(),
  micrCode: z.string().optional().nullable(),
  cancelledChequeUrl: z.string().optional().nullable(),
  isPrimary: z.boolean().optional().nullable(),
  isNachEnabled: z.boolean().optional().nullable(),
  nachRef: z.string().optional().nullable(),
  verificationStatus: z.string().optional().nullable(),
  verifiedAt: z.coerce.date().optional().nullable(),
  verifiedBy: z.number().optional().nullable(),
  rejectionReason: z.string().optional().nullable(),
  status: z.string(),
});

export type CreateBankAccountsDto = z.infer<typeof CreateBankAccountsSchema>;