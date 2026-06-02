// Auto-generated entity for `reason_master` (14 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface ReasonMaster {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id. NULL = global platform reason
  moduleName?: string;  // Which module this reason is for
  reasonType?: string;  // Category of reason
  reasonCode?: string;  // Machine-readable code. UNIQUE per module+reason_type. e.g. CUST_REQUEST, DAMAGE
  reasonText?: string;  // Human-readable reason shown in UI e.g. "Cancelled on customer request"
  requiresNote?: boolean;  // TRUE = user must type additional notes when selecting this reason
  isActive?: boolean;  // Default TRUE. Inactive reasons hidden from dropdowns
  createdBy?: number;  // FK → masterdata_users.id
  updatedBy?: number;  // FK → masterdata_users.id
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
