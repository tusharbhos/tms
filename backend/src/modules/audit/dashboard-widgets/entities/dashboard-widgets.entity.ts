// Auto-generated entity for `dashboard_widgets` (22 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface DashboardWidgets {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id
  dashboardId?: number;  // FK → masterdata_dashboards.id. Mandatory
  widgetKey?: string;  // Machine key e.g. kpi.total_shipments_today. UNIQUE per dashboard
  widgetName?: string;  // Display label e.g. "Total Shipments Today"
  widgetType?: string;  // Visual type of this widget
  dataSource?: string;  // API endpoint or query name that feeds this widget
  refreshSeconds?: number;  // Auto-refresh interval. 0 = no auto-refresh
  positionX?: number;  // Grid column start (0-based)
  positionY?: number;  // Grid row start (0-based)
  width?: number;  // Grid columns spanned
  height?: number;  // Grid rows spanned
  config?: Record<string, any>;  // Widget-specific config: filters, colors, thresholds, labels
  sortOrder?: number;  // Render order fallback if grid layout missing
  isVisible?: boolean;  // FALSE = hidden but saved. Default TRUE
  featureFlagKey?: string;  // If set, widget only shown when feature enabled. Nullable
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id. Who soft-deleted
}
