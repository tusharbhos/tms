// Auto-generated entity for `txn_manifest_lrs` (25 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface ManifestLrs {
  id: number;  // PK autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id
  manifestId?: number;  // FK → txn_manifest.id
  lrId?: number;  // FK → txn_lr.id
  numPackages?: number;  // Packages for this LR in manifest
  weightKg?: number;  // Weight of this LR
  isLoaded?: boolean;  // TRUE = physically loaded in vehicle
  loadedBy?: number;  // FK → masterdata_users.id — who scanned/loaded
  loadedAt?: Date;  // When this LR was loaded
  isReceived?: boolean;  // TRUE = received at destination hub
  receivedBy?: number;  // FK → masterdata_users.id — who received
  receivedAt?: Date;  // When received at destination hub
  shortagePkg?: number;  // Packages short-landed
  excessPkg?: number;  // Packages excess-landed
  damageFlag?: boolean;  // Goods damaged in transit
  loadedScanTime?: Date;  // Exact timestamp when barcode scanner confirmed LR loaded into vehicle. More precise than loaded_at (which is user-entere
  receivedScanTime?: Date;  // Exact timestamp when destination hub scanner confirmed LR received. Auto from scanner — cannot be manually backdated for
  exceptionStatus?: string;  // Exception detected for this LR during manifest lifecycle. NORMAL = no issues. SHORTAGE = fewer packages arrived. WRONG_C
  exceptionRemarks?: string;  // Details of exception — what happened, when discovered, by whom. Required if exception_status ≠ NORMAL.
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
}
