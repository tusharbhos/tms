// Auto-generated entity for `driver` (24 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Driver {
  id: number;  // PK, autoincrement
  uuid?: string;  // UNIQUE — External/API-safe identifier. Prevents sequential ID scraping. Generated on INSERT.
  tenantId?: number;  // FK → tenant
  vendorId?: number;  // FK → vendor (if attached driver)
  homeOfficeId?: number;  // FK → office. Driver's base location
  name?: string;  // Full name. Mandatory
  mobile?: string;  // Mandatory primary contact
  dlNumber?: string;  // Driving Licence number. Unique
  dlCategory?: string;  // LMV, HMV, Transport — what vehicles licensed
  dlExpiryDate?: Date;  // DL expiry — 30-day alert triggered
  emergencyContactName?: string;  // Emergency contact person name
  emergencyContactMobile?: string;  // Emergency contact mobile
  bloodGroup?: string;  // A+, B+, O+, AB- etc.
  medicalFitnessExpiry?: Date;  // Mandatory annual medical fitness certificate expiry
  driverStatus?: string;  // Real-time availability
  driverRating?: number;  // 0.00–5.00 computed from trip feedback
  totalTrips?: number;  // Lifetime completed trips counter
  active?: boolean;  // Default TRUE
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
