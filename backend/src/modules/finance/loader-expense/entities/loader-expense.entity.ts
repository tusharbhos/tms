// Auto-generated entity for `fm_loader_expense` (22 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface LoaderExpense {
  id: number;  // PK autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id
  officeId?: number;  // FK → masterdata_office.id — which hub
  manifestId?: number;  // FK → txn_manifest.id — loading for which manifest
  tripId?: number;  // FK → txn_trip.id
  expenseDate?: Date;  // Date of loading activity
  loaderType?: string;  // Type of labor
  numLoaders?: number;  // Number of loaders engaged
  numHours?: number;  // Hours worked
  numPackages?: number;  // Packages loaded/unloaded
  rateType?: string;  // How loaders charged
  rate?: number;  // Rate (per hour or per package)
  totalAmount?: number;  // Total loader expense
  paidBy?: string;  // Who bore loading cost
  paymentRef?: string;  // Payment reference if cash paid
  billUrl?: string;  // CDN URL of loader receipt
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
