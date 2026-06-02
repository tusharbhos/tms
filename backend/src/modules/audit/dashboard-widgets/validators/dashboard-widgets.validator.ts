import { CreateDashboardWidgetsSchema } from '../dto/create-dashboard-widgets.dto';
import { UpdateDashboardWidgetsSchema } from '../dto/update-dashboard-widgets.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateDashboardWidgetsSchema,
  update: UpdateDashboardWidgetsSchema,
};
