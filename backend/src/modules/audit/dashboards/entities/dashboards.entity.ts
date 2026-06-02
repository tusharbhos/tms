// Auto-generated entity for `dashboards` (17 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Dashboards {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id. Mandatory
  name?: string;  // Dashboard display name e.g. Ops Manager Dashboard
  slug?: string;  // URL-safe slug e.g. ops-manager-dashboard. UNIQUE per tenant
  description?: string;  // Purpose of this dashboard
  scope?: string;  // system=global, role=role-assigned, user=personal
  roleId?: number;  // FK → masterdata_role.id. NULL if scope≠role
  userId?: number;  // FK → masterdata_users.id. NULL if scope≠user
  isDefault?: boolean;  // TRUE = shown on login if no personal dashboard set
  layoutConfig?: Record<string, any>;  // Grid layout JSON (columns, rows, breakpoints)
  status?: string;  // Default active
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id. Who soft-deleted
}
