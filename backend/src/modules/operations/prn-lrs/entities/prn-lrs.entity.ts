// Auto-generated entity for `txn_prn_lrs` (23 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface PrnLrs {
  id: number;  // PK autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id
  prnId?: number;  // FK → txn_prn.id
  lrId?: number;  // FK → txn_lr.id — which LR to pick up
  bookingId?: number;  // FK → txn_booking.id — for quick reference
  seqNo?: number;  // Pickup sequence — driver visits in this order
  pickupAddress?: string;  // Consignor address for this pickup — with map link
  pickupLat?: number;  // Consignor GPS latitude
  pickupLng?: number;  // Consignor GPS longitude
  numPackages?: number;  // Packages to pick up at this stop
  pickupStatus?: string;  // Status of this individual pickup
  actualPackages?: number;  // Actual packages picked — may differ from num_packages
  pickupTime?: Date;  // Actual time of pickup by driver
  pickupLatActual?: number;  // GPS latitude at time of actual pickup
  pickupLngActual?: number;  // GPS longitude at time of actual pickup
  pickupPhotoUrl?: string;  // Photo of goods at pickup — from driver app
  failReason?: string;  // Why pickup failed — if pickup_status=FAILED
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
