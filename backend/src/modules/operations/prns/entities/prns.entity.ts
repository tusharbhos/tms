// Auto-generated entity for `txn_prn` (26 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Prn {
  id: number;  // PK autoincrement
  uuid?: string;  // API-safe UUID
  prnNo?: string;  // Auto-generated PRN number from number_series_config
  tenantId?: number;  // FK → masterdata_tenant.id
  officeId?: number;  // FK → masterdata_office.id — Pickup branch
  prnDate?: Date;  // PRN date
  driverId?: number ;  // FK → masterdata_driver.id — Assigned driver
  vehicleId?: number;  // FK → masterdata_vehicles.id — Assigned vehicle
  vehicleNo?: string;  // Snapshot vehicle number at PRN time
  driverName?: string;  // Snapshot driver name at PRN time
  driverMobile?: string;  // Snapshot driver mobile — for OTP + WhatsApp
  routeStartLat?: number;  // GPS: driver start location latitude
  routeStartLng?: number;  // GPS: driver start location longitude
  numPickups?: number;  // Number of pickups in this PRN
  totalPackages?: number;  // Total packages across all pickups
  estimatedKm?: number;  // Estimated route distance in KM
  prnStatus?: string;  // Status: CREATED→DISPATCHED→IN_PROGRESS→COMPLETED→CANCELLED
  startTime?: Date;  // When driver actually started
  endTime?: Date;  // When PRN completed (all pickups done)
  remarks?: string;  // Ops remarks
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
