// Auto-generated entity for `status_master` (18 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface StatusMaster {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id. NULL = global/platform-level status
  moduleName?: string;  // Which module this status belongs to
  statusCode?: string;  // Machine-readable code. UNIQUE per module. e.g. PENDING, IN_TRANSIT, DELIVERED
  statusName?: string;  // Human-readable label shown in UI e.g. "In Transit", "Out for Delivery"
  colorCode?: string;  // Hex color e.g. #FFA500 for orange. Used for badge/chip coloring in UI
  textColor?: string;  // Text color for contrast e.g. #FFFFFF or #000000. Default #FFFFFF
  sequenceNo?: number;  // Display order within the module. Lower = first in dropdowns/kanban
  isFinalStatus?: boolean;  // TRUE = no further transitions allowed. e.g. DELIVERED, CANCELLED, PAID
  isDefault?: boolean;  // TRUE = auto-assigned on record creation. Max 1 per module
  description?: string;  // Internal notes about when this status is applied. Nullable
  isActive?: boolean;  // Default TRUE. Inactive statuses hidden from UI
  createdBy?: number;  // FK → masterdata_users.id
  updatedBy?: number;  // FK → masterdata_users.id
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
