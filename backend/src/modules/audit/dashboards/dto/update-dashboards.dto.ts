import { z } from 'zod';
import { CreateDashboardsSchema } from './create-dashboards.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateDashboardsSchema = CreateDashboardsSchema.partial();
export type UpdateDashboardsDto = z.infer<typeof UpdateDashboardsSchema>;
