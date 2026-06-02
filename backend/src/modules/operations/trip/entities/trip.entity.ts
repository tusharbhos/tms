// Auto-generated entity for `txn_trip` (44 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Trip {
  id: number;  // PK autoincrement
  uuid?: string;  // API-safe UUID
  tripNo?: string;  // Auto-generated from number_series_config
  tenantId?: number;  // FK → masterdata_tenant.id
  tripType?: string;  // Type of trip
  manifestId?: number;  // FK → txn_manifest.id — for THC/LINEHAUL trips
  drsId?: number;  // FK → txn_drs.id — for DRS trips
  originOfficeId?: number;  // FK → masterdata_office.id — trip origin hub
  destinationOfficeId?: number;  // FK → masterdata_office.id — final destination
  vendorId?: number;  // FK → masterdata_vendor.id — transport vendor
  vehicleId?: number;  // FK → masterdata_vehicles.id
  vehicleNo?: string;  // Snapshot vehicle number
  driverId?: number;  // FK → masterdata_driver.id
  driverName?: string;  // Snapshot driver name
  driverMobile?: string;  // Snapshot driver mobile
  numLrs?: number;  // Total LRs in trip
  totalPackages?: number;  // Total packages in trip
  tripDate?: Date;  // Date of trip
  tripStatus?: string;  // CREATED→LOADING→DISPATCHED→IN_TRANSIT→ARRIVED→COMPLETED/CANCELLED
  startTime?: Date;  // Actual trip start time — when driver marks start
  endTime?: Date;  // Actual trip end time
  estimatedKm?: number;  // Estimated distance KM
  actualKm?: number;  // Actual distance from meter_end - meter_start
  meterStart?: number;  // Odometer at trip start
  meterEnd?: number;  // Odometer at trip end
  freightCharges?: number;  // Agreed freight to pay vendor
  advancePaid?: number;  // Advance given to driver at start
  fuelFilledLiters?: number;  // Fuel filled during trip — from fm_fuel_log
  gpsDeviceId?: string;  // GPS tracker ID — for live location API
  consolidatedEwbNo?: string;  // Consolidated EWB for Part-B update
  cancelReasonId?: number;  // FK → masterdata_reason_master.id
  remarks?: string;  // Ops notes about this trip
  routeId?: number;  // FK → future txn_routes table (or masterdata_routes). Planned route for this trip: origin hub → stops → destination hub. 
  plannedStartTime?: Date;  // Planned/scheduled departure time. Distinct from actual start_time. Used in SLA tracking: delay = actual_start_time - pla
  plannedEndTime?: Date;  // Expected arrival/completion time. Used for SLA commitment to destination hub / consignee.
  actualStartTime?: Date;  // When driver actually tapped "Start Trip" in app. Separate from start_time (which may be ops-entered). Delay = actual_sta
  actualEndTime?: Date;  // When trip was actually completed — driver tapped "End Trip" or hub confirmed arrival. Actual transit time = actual_end_t
  delayReasonId?: number;  // FK → masterdata_reason_master.id (module=trip, reason_type=delay). Required if actual_end_time > planned_end_time + 30 m
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
}

export const TripStatuses = ["CREATED", "SCHEDULED", "IN_PROGRESS", "HALTED", "COMPLETED", "COMPLETED_DELAYED", "CANCELLED"] as const;
export type TripStatus = (typeof TripStatuses)[number];

export const TripTransitions: Record<string, string[]> = {
  "CREATED": [
    "SCHEDULED",
    "CANCELLED"
  ],
  "SCHEDULED": [
    "IN_PROGRESS",
    "CANCELLED"
  ],
  "IN_PROGRESS": [
    "HALTED",
    "COMPLETED",
    "COMPLETED_DELAYED"
  ],
  "HALTED": [
    "IN_PROGRESS",
    "CANCELLED"
  ],
  "COMPLETED": [],
  "COMPLETED_DELAYED": [],
  "CANCELLED": []
};
