// Auto-generated entity for `departments` (14 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Departments {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → tenant
  parentDepartmentId?: number;  // Self FK for nested departments
  departmentCode?: string;  // Short code: FIN, OPS, HR, DISP, FLEET
  name?: string;  // Department name. Mandatory
  hodUserId?: number;  // FK → users. Head of Department
  description?: string;  // Department description
  isActive?: boolean;  // Default TRUE. Soft-enable/disable without deleting
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
