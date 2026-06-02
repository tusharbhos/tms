// Auto-generated entity for `txn_drs` (27 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Drs {
  id: number;  // PK autoincrement
  uuid?: string;  // API-safe UUID
  drsNo?: string;  // Auto-generated from number_series_config
  tenantId?: number;  // FK → masterdata_tenant.id
  officeId?: number;  // FK → masterdata_office.id — delivery hub
  drsDate?: Date;  // Date of DRS
  tripId?: number;  // FK → txn_trip.id — delivery trip for this DRS
  driverId?: number;  // FK → masterdata_driver.id
  vehicleId?: number;  // FK → masterdata_vehicles.id
  vehicleNo?: string;  // Snapshot vehicle number
  driverMobile?: string;  // Snapshot driver mobile
  numLrs?: number;  // Total LRs in DRS
  totalPackages?: number;  // Total packages
  drsStatus?: string;  // CREATED→DISPATCHED→IN_PROGRESS→COMPLETED→CANCELLED
  startTime?: Date;  // When driver started DRS
  endTime?: Date;  // When DRS completed
  totalCodAmount?: number;  // Total COD to collect across all LRs
  codCollected?: number;  // Total COD actually collected
  cashSubmitted?: boolean;  // TRUE = driver submitted COD cash to hub
  estimatedKm?: number;  // Estimated delivery route KM
  remarks?: string;  // Ops remarks
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}

export const DrsStatuses = ["CREATED", "DISPATCHED", "IN_PROGRESS", "COMPLETED", "RECONCILED", "CANCELLED"] as const;
export type DrsStatus = (typeof DrsStatuses)[number];

export const DrsTransitions: Record<string, string[]> = {
  "CREATED": [
    "DISPATCHED",
    "CANCELLED"
  ],
  "DISPATCHED": [
    "IN_PROGRESS",
    "CANCELLED"
  ],
  "IN_PROGRESS": [
    "COMPLETED"
  ],
  "COMPLETED": [
    "RECONCILED"
  ],
  "RECONCILED": [],
  "CANCELLED": []
};
