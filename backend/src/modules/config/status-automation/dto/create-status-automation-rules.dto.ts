import { z } from 'zod';

// CREATE DTO for status_automation_rules — validated business fields only.
export const CreateStatusAutomationRulesSchema = z.object({
  ruleName: z.string().optional().nullable(),
  triggerEvent: z.string().optional().nullable(),
  targetEntity: z.string().optional().nullable(),
  targetStatus: z.string().optional().nullable(),
  conditionJson: z.record(z.any()).optional().nullable(),
  autoNotifyCustomer: z.boolean().optional().nullable(),
  notificationEventCode: z.string().optional().nullable(),
  createLrStateLog: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
});

export type CreateStatusAutomationRulesDto = z.infer<typeof CreateStatusAutomationRulesSchema>;