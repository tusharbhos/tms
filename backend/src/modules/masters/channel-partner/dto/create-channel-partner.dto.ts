import { z } from 'zod';

// CREATE DTO for channel_partner — validated business fields only.
export const CreateChannelPartnerSchema = z.object({
  companyId: z.number(),
  officeId: z.number(),
  parentCpId: z.number().optional().nullable(),
  cpCode: z.string().optional().nullable(),
  name: z.string(),
  contactPerson: z.string().optional().nullable(),
  mobile: z.string(),
  email: z.string().email().optional().nullable(),
  cpType: z.string().optional().nullable(),
  gstNumber: z.string().optional().nullable(),
  panNumber: z.string().optional().nullable(),
  agreementNumber: z.string().optional().nullable(),
  agreementStartDate: z.coerce.date().optional().nullable(),
  agreementEndDate: z.coerce.date().optional().nullable(),
  autoRenewal: z.boolean().optional().nullable(),
  commissionType: z.string().optional().nullable(),
  commissionValue: z.number().optional().nullable(),
  paymentCycle: z.string().optional().nullable(),
  creditLimit: z.number().optional().nullable(),
  creditDays: z.number().optional().nullable(),
  rating: z.number().optional().nullable(),
  assignedUserId: z.number(),
  status: z.string(),
  onboardingStatus: z.string().optional().nullable(),
  blacklistReason: z.string().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
});

export type CreateChannelPartnerDto = z.infer<typeof CreateChannelPartnerSchema>;