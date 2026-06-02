// Auto-generated entity for `txn_vendor_voucher_items` (14 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface VendorVoucherItems {
  id: number;  // PK autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id
  voucherId?: number;  // FK → txn_vendor_voucher.id
  lineType?: string;  // What this line represents
  description?: string;  // Line description
  amount?: number;  // Amount — positive=charge, negative=deduction
  referenceId?: number;  // Reference to source record (trip_id, fuel_log_id etc.)
  referenceType?: string;  // Type of reference: trip, fuel_log, loader_expense
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
