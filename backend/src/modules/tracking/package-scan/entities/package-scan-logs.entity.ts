// Auto-generated entity for `txn_package_scan_logs` (24 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface PackageScanLogs {
  id: number;  // PK autoincrement
  uuid?: string;  // External API-safe identifier. UUID4 generated on INSERT trigger. Used in all REST API URLs and mobile app references. Ne
  tenantId?: number;  // FK → masterdata_tenant.id
  barcodeNo?: string;  // Package barcode scanned — from txn_booking_items.barcode_no
  lrId?: number;  // FK → txn_lr.id
  bookingId?: number;  // FK → txn_booking.id
  bookingItemId?: number;  // FK → txn_booking_items.id — exact item this package belongs to
  scanStage?: string;  // At what stage the scan happened. PICKUP=at consignor. HUB_RECEIVE=origin hub. MANIFEST_LOAD=loading into vehicle. MANIFE
  scanResult?: string;  // What the scan revealed about this package. OK=normal. DAMAGE=physical damage visible. SHORTAGE=fewer pcs than manifest. 
  officeId?: number;  // FK → masterdata_office.id — hub where scan happened
  tripId?: number;  // FK → txn_trip.id — which trip this scan is during
  scannedBy?: number;  // FK → masterdata_users.id — who scanned
  scanDeviceId?: string;  // Scanner device ID — barcode gun or mobile device IMEI
  latitude?: number;  // GPS latitude at scan moment
  longitude?: number;  // GPS longitude at scan moment
  scannedAt?: Date;  // Exact timestamp of scan — from device clock
  photoUrl?: string;  // Photo captured at scan if damage detected
  remarks?: string;  // Scan remarks — damage description, quantity discrepancy notes
  createdBy?: number;  // FK → masterdata_users.id — Who created
  updatedBy?: number;  // FK → masterdata_users.id — Last update
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete. NULL = active
}
