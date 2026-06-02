// Auto-generated entity for `fm_fuel_log` (21 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface FuelLog {
  id: number;  // PK autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id
  tripId?: number;  // FK → txn_trip.id — which trip consumed fuel
  vehicleId?: number;  // FK → masterdata_vehicles.id
  driverId?: number;  // FK → masterdata_driver.id
  fuelDate?: Date;  // Date of fuel fill
  pumpName?: string;  // Fuel pump / petrol station name
  fuelType?: string;  // Fuel type
  quantityLiters?: number;  // Liters filled
  ratePerLiter?: number;  // Rate per liter at time of filling
  totalAmount?: number;  // Total fuel cost = quantity × rate
  meterReading?: number;  // Odometer at fuel fill
  billUrl?: string;  // CDN URL of fuel bill photo
  isCompanyPaid?: boolean;  // TRUE = company-account fuel | FALSE = driver advance
  remarks?: string;  // Remarks
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
