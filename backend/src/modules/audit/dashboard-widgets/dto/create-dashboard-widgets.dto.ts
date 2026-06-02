import { z } from 'zod';

// CREATE DTO for dashboard_widgets — validated business fields only.
export const CreateDashboardWidgetsSchema = z.object({
  dashboardId: z.number(),
  widgetKey: z.string().optional().nullable(),
  widgetName: z.string().optional().nullable(),
  widgetType: z.string().optional().nullable(),
  dataSource: z.string().optional().nullable(),
  refreshSeconds: z.number().optional().nullable(),
  positionX: z.number().optional().nullable(),
  positionY: z.number().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  config: z.record(z.any()).optional().nullable(),
  sortOrder: z.number().optional().nullable(),
  isVisible: z.boolean().optional().nullable(),
  featureFlagKey: z.string().optional().nullable(),
});

export type CreateDashboardWidgetsDto = z.infer<typeof CreateDashboardWidgetsSchema>;