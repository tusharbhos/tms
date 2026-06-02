// Auto-generated entity for `role` (15 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Role {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → tenant. Nullable (NULL = global system role)
  name?: string;  // e.g. Branch Manager, Dispatch Operator, Finance Head
  description?: string;  // Role description
  roleLevel?: number;  // Hierarchy depth: 1=SuperAdmin, 2=TenantAdmin, 5=Operator
  isSystemRole?: boolean;  // TRUE = cannot be edited or deleted by tenant users
  officeScope?: string;  // Data visibility scope for office
  departmentScope?: string;  // Data visibility scope for department
  isActive?: boolean;  // Default TRUE. Soft-enable/disable without deleting
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
