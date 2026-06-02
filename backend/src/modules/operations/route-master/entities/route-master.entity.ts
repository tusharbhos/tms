// Auto-generated entity for `txn_route_master` (21 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface RouteMaster {
  id: number;  // PK — Auto-increment.
  uuid?: string;  // External-safe UUID.
  tenantId?: number;  // FK → masterdata_tenant.id. Mandatory.
  companyId?: number;  // FK → masterdata_company.id. Legal entity for this route.
  routeCode?: string;  // Unique route code. e.g. PNE-MUM-SRT-AMD. Auto or manual.
  routeName?: string;  // Route display name. e.g. Pune → Mumbai → Surat → Ahmedabad.
  routeType?: string;  // LINEHAUL: hub-to-hub long distance. LOCAL: city delivery. CROSS_DOCK: transshipment.
  originOfficeId?: number;  // FK → masterdata_office.id. First stop / departure point.
  destOfficeId?: number;  // FK → masterdata_office.id. Last stop / destination.
  totalStops?: number;  // Total number of stops. Auto-calculated: COUNT(txn_route_stops) for this route.
  estDistanceKm?: number;  // Estimated total distance in KM for this route.
  estDurationHrs?: number;  // Estimated travel time in hours.
  frequency?: string;  // How often this route runs. DAILY, MON_WED_FRI, WEEKLY etc.
  vehicleType?: string;  // Recommended vehicle type for this route. 32FT, 24FT, TATA_ACE.
  isActive?: boolean;  // TRUE = route available for trip creation. FALSE = deactivated.
  createdBy?: number;  // FK → masterdata_users.id
  updatedBy?: number;  // FK → masterdata_users.id
  createdAt: Date;  // Auto by DB.
  updatedAt: Date;  // Auto by DB.
  deletedAt?: Date;  // Soft-delete. NULL = active.
  deletedBy?: number;  // FK → masterdata_users.id
}
