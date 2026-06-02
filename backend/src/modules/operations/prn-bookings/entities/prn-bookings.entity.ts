// Auto-generated entity for `txn_prn_bookings` (30 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface PrnBookings {
  id: number;  // PK autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id
  prnId?: number;  // FK → txn_prn.id — which PRN this pickup is under
  bookingId?: number;  // FK → txn_booking.id — which booking to pick up. NOTE: LR does NOT exist yet when PRN is created.
  seqNo?: number;  // Pickup sequence in PRN route — driver visits in this order
  consignorName?: string;  // Snapshot: consignor name for driver reference
  consignorMobile?: string;  // Consignor mobile — driver calls if not available
  pickupAddress?: string;  // Full pickup address with locality
  pickupLatitude?: number;  // GPS latitude of pickup location
  pickupLongitude?: number;  // GPS longitude of pickup location
  declaredPackages?: number;  // Packages consignor declared at booking time
  declaredWeightKg?: number;  // Weight declared at booking. May differ from actual.
  pickupStatus?: string;  // Status of this individual pickup attempt. PARTIAL = some packages not available. FAILED = consignor not present. SKIPPED
  packagesPicked?: number;  // Actual packages handed by consignor to driver
  actualWeightKg?: number;  // Weight measured at pickup — driver entry or mini-scale
  weightVariancePct?: number;  // Calculated: |actual - declared| / declared × 100. If > 5%: alert ops before LR generation.
  pickupPhotoUrl?: string;  // CDN URL of goods photo at pickup — evidence of condition
  pickupTime?: Date;  // Actual datetime when driver completed pickup
  lrId?: number;  // FK → txn_lr.id — set AFTER pickup verified and LR generated. NULL until pickup complete + weight verified.
  lrGeneratedAt?: Date;  // Timestamp when LR was auto-generated from this pickup
  failReasonId?: number;  // FK → masterdata_reason_master.id — why pickup failed
  remarks?: string;  // Driver notes about this pickup
  createdBy?: number;  // FK → masterdata_users.id — Who created
  updatedBy?: number;  // FK → masterdata_users.id — Last update
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
