import { z } from 'zod';
import { CreateDashboardWidgetsSchema } from './create-dashboard-widgets.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateDashboardWidgetsSchema = CreateDashboardWidgetsSchema.partial();
export type UpdateDashboardWidgetsDto = z.infer<typeof UpdateDashboardWidgetsSchema>;
