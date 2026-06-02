// Auto-generated entity for `txn_exception_logs` (24 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface ExceptionLogs {
  id: number;  // PK autoincrement
  uuid?: string;  // External API-safe identifier. UUID4 generated on INSERT trigger. Used in all REST API URLs and mobile app references. Ne
  tenantId?: number;  // FK → masterdata_tenant.id
  exceptionCode?: string;  // Machine-readable exception code. e.g. PKG_SHORTAGE, PKG_DAMAGE, WEIGHT_VARIANCE, OTP_FAILED, DELIVERY_FAILED, EWB_EXPIRE
  severity?: string;  // Impact level. CRITICAL = shipment blocked/SLA breach. HIGH = customer impact. MEDIUM = ops action needed. LOW = informat
  entityType?: string;  // Which entity has the exception.
  entityId?: number;  // PK of the entity with exception
  lrId?: number;  // FK → txn_lr.id — always link to LR even for package exceptions
  exceptionTitle?: string;  // Short description for exception dashboard card
  exceptionDetails?: string;  // Full details: what, where, when, quantity, condition
  triggeredBy?: string;  // What auto-created this exception.
  triggerRefId?: number;  // ID of txn_package_scan_logs / txn_pod etc that triggered
  resolutionStatus?: string;  // Exception handling state. OPEN: raised, unassigned. INVESTIGATING: ops working. RESOLVED: action taken. CLOSED: customer
  assignedTo?: number;  // FK → masterdata_users.id — ops person responsible
  resolutionAction?: string;  // What action was taken to resolve
  resolutionAt?: Date;  // When exception was resolved
  customerNotified?: boolean;  // Was consignor/consignee notified about this exception
  exceptionImageUrl?: string;  // Photo evidence of exception (damage photo, shortage)
  createdBy?: number;  // FK → masterdata_users.id
  createdAt: Date;  // Auto by DB
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
