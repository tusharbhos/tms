// Auto-generated entity for `txn_trip_lrs` (20 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface TripLrs {
  id: number;  // PK autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id
  tripId?: number;  // FK → txn_trip.id
  lrId?: number;  // FK → txn_lr.id
  stopSeq?: number;  // Delivery stop sequence — for DRS route order
  deliveryAddress?: string;  // Consignee delivery address for this stop
  delLat?: number;  // Delivery GPS latitude
  delLng?: number;  // Delivery GPS longitude
  numPackages?: number;  // Packages to deliver at this stop
  status?: string;  // Delivery status of this LR in trip
  failReasonId?: number;  // FK → masterdata_reason_master.id — Why delivery failed
  deliveryTime?: Date;  // Actual delivery time
  codAmount?: number;  // COD amount to collect at delivery
  codCollected?: number;  // Actual COD collected
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
