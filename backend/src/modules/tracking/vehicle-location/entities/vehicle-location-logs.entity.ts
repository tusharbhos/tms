// Auto-generated entity for `txn_vehicle_location_logs` (14 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface VehicleLocationLogs {
  id: number;  // PK autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id
  tripId?: number;  // FK → txn_trip.id
  vehicleId?: number;  // FK → masterdata_vehicles.id
  driverId?: number;  // FK → masterdata_driver.id
  latitude?: number;  // GPS latitude
  longitude?: number;  // GPS longitude
  speedKmph?: number;  // Vehicle speed in km/h
  headingDeg?: number;  // Direction in degrees 0-360
  accuracyM?: number;  // GPS accuracy in meters
  source?: string;  // Where location came from
  loggedAt?: Date;  // Actual time of GPS reading — from device
  createdAt: Date;  // When record was inserted
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
}
