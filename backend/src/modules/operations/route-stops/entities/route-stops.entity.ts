// Auto-generated entity for `txn_route_stops` (16 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface RouteStops {
  id: number;  // PK — Auto-increment.
  tenantId?: number;  // FK → masterdata_tenant.id. Mandatory.
  routeId?: number;  // FK → txn_route_master.id. Parent route.
  stopSequence?: number;  // Order of this stop. 1=origin, 2=first intermediate, last=destination.
  officeId?: number;  // FK → masterdata_office.id. The office/hub at this stop.
  stopType?: number;  // Role of this stop in the route.
  estDistanceKm?: number;  // Distance from previous stop to this stop in KM.
  estDurationHrs?: number;  // Estimated travel time from previous stop to this stop in hours.
  loadingAllowed?: boolean;  // TRUE = LRs can be loaded at this stop.
  unloadingAllowed?: boolean;  // TRUE = LRs can be unloaded/delivered at this stop.
  createdBy?: number;  // FK → masterdata_users.id
  createdAt: Date;  // Auto by DB.
  updatedAt: Date;  // Auto by DB.
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
