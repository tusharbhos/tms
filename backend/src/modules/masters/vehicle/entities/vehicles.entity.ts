// Auto-generated entity for `vehicles` (48 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Vehicles {
  id: number;  // PK, autoincrement
  uuid?: string;  // UNIQUE — External/API-safe identifier. Prevents sequential ID scraping. Generated on INSERT.
  tenantId?: number;  // FK → tenant
  companyTag?: number;  // FK → company
  baseOfficeId?: number;  // FK → office. Home station of vehicle
  vendorId?: number;  // FK → vendor (if attached/hired vehicle)
  rcNum?: string;  // UNIQUE. RTO Registration number e.g. MH12AB1234
  vehicleNum?: string;  // Display number (same or formatted)
  vehicleOwnership?: string;  // OWN | ATTACHED | MARKET
  ownerType?: string;  // Detailed ownership model
  bodyType?: string;  // Cargo type
  make?: string;  // Manufacturer: Tata, Ashok Leyland, Eicher…
  model?: string;  // Vehicle model name
  specification?: string;  // Variant/body spec
  subSpecification?: string;  // Sub-variant
  fuelType?: string;  // Diesel, CNG, Electric, LNG
  gvw?: number;  // Gross Vehicle Weight
  capacity?: number;  // Payload capacity (cargo weight)
  gvwCapacityUnit?: string;  // KG | TON
  length?: number;  // Vehicle body length
  width?: number;  // Vehicle body width
  height?: number;  // Vehicle body height
  lwhUnit?: string;  // METER | FEET
  vehicleContactMobile1?: string;  // Driver/owner contact 1
  vehicleContactMobile2?: string;  // Driver/owner contact 2
  rtoRegExpiry?: Date;  // RTO registration certificate expiry
  rcUrl?: string;  // Registration Card PDF URL
  insurancePolicyNum?: string;  // Insurance policy number
  insuranceExpiry?: Date;  // Insurance expiry — 30-day alert
  insuranceDocUrl?: string;  // Insurance policy PDF URL
  fitnessCertNum?: string;  // Fitness certificate number
  fitnessCertExpiry?: Date;  // Fitness certificate expiry
  fitnessCertUrl?: string;  // Fitness certificate PDF URL
  permitExpiry?: Date;  // State/national permit renewal alert
  pollutionExpiry?: Date;  // PUC certificate expiry
  gpsDeviceId?: string;  // GPS tracker IMEI/serial linked to this vehicle
  manufacturingYear?: string;  // Vehicle manufacturing year
  vehicleStatus?: number;  // Real-time state
  currentOfficeId?: number;  // FK → office. Current stationed location
  active?: boolean;  // Default TRUE
  status?: string;  // CREATED | APPROVED | REJECTED | PENDING_UPDATE | PENDING_APPROVAL
  note?: string;  // Reviewer/ops notes
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
