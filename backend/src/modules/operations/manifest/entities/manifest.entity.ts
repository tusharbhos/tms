// Auto-generated entity for `txn_manifest` (36 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Manifest {
  id: number;  // PK autoincrement
  uuid?: string;  // API-safe UUID
  manifestNo?: string;  // Auto-generated from number_series_config
  tenantId?: number;  // FK → masterdata_tenant.id
  companyId?: number;  // FK → masterdata_company.id
  originOfficeId?: number;  // FK → masterdata_office.id — dispatching hub
  destinationOfficeId?: number;  // FK → masterdata_office.id — receiving hub
  manifestDate?: Date;  // Date of manifest creation
  vendorId?: number;  // FK → masterdata_vendor.id — transport vendor
  vehicleId?: number;  // FK → masterdata_vehicles.id
  vehicleNo?: string;  // Snapshot vehicle number for print
  driverId?: number;  // FK → masterdata_driver.id
  driverName?: string;  // Snapshot driver name
  driverMobile?: string;  // Snapshot driver mobile — send manifest WhatsApp
  numLrs?: number;  // Total LRs in this manifest
  totalPackages?: number;  // Total packages in manifest
  totalWeightKg?: number;  // Total weight in KG
  tripId?: number;  // FK → txn_trip.id — linehaul trip for this manifest
  consolidatedEwbNo?: string;  // Consolidated e-way bill number for entire manifest
  estimatedKm?: number;  // Estimated trip distance in KM
  freightCharges?: number;  // Freight to pay vendor for this trip
  loadingCharges?: number;  // Loading/unloading charges at hub
  advancePaid?: number;  // Advance payment given to driver/vendor
  manifestStatus?: string;  // Status: CREATED→LOADING→DISPATCHED→IN_TRANSIT→ARRIVED→CLOSED
  dispatchedAt?: Date;  // When manifest vehicle departed from origin hub
  arrivedAt?: Date;  // When vehicle arrived at destination hub
  meterStart?: number;  // Vehicle odometer at trip start
  meterEnd?: number;  // Vehicle odometer at trip end
  podReceivedBy?: number;  // FK → masterdata_users.id — Hub staff who received manifest
  cancelReasonId?: number;  // FK → masterdata_reason_master.id
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}

export const ManifestStatuses = ["CREATED", "LOADING", "DISPATCHED", "IN_TRANSIT", "ARRIVED", "CLOSED", "CANCELLED"] as const;
export type ManifestStatus = (typeof ManifestStatuses)[number];

export const ManifestTransitions: Record<string, string[]> = {
  "CREATED": [
    "LOADING",
    "CANCELLED"
  ],
  "LOADING": [
    "DISPATCHED",
    "CANCELLED"
  ],
  "DISPATCHED": [
    "IN_TRANSIT"
  ],
  "IN_TRANSIT": [
    "ARRIVED"
  ],
  "ARRIVED": [
    "CLOSED"
  ],
  "CLOSED": [],
  "CANCELLED": []
};
