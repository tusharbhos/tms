import { CreateStatusAutomationRulesSchema } from '../dto/create-status-automation-rules.dto';
import { UpdateStatusAutomationRulesSchema } from '../dto/update-status-automation-rules.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateStatusAutomationRulesSchema,
  update: UpdateStatusAutomationRulesSchema,
};
