import { z } from 'zod';
import { CreateStatusAutomationRulesSchema } from './create-status-automation-rules.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateStatusAutomationRulesSchema = CreateStatusAutomationRulesSchema.partial();
export type UpdateStatusAutomationRulesDto = z.infer<typeof UpdateStatusAutomationRulesSchema>;
