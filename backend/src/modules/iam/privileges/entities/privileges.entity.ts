// Auto-generated entity for `privileges` (14 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Privileges {
  id: number;  // PK, autoincrement
  name?: string;  // UNIQUE. e.g. customer.create, invoice.view, vehicle.delete
  description?: string;  // Human-readable description
  moduleName?: string;  // Grouping: customer, invoice, vehicle, driver, finance…
  actionName?: string;  // CRUD: create, read, update, delete, export, approve
  apiEndpoint?: string;  // API route this privilege guards e.g. POST /api/customers
  parentPrivilegeId?: number;  // Self FK for menu/module hierarchy
  isActive?: boolean;  // Disable privilege without deleting it
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
