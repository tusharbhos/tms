// Auto-generated entity for `incident_type_master` (19 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface IncidentTypeMaster {
  id: number;  // PK autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id. NULL = platform-wide type
  incidentCode?: string;  // Unique code. e.g. PRODUCT_DAMAGE, ACCIDENT, THEFT, VEHICLE_BREAKDOWN, POLICE_HOLD, RTO_HOLD, FIRE_DAMAGE, DRIVER_FIGHT, 
  incidentName?: string;  // Display name. e.g. 'Product Damage', 'Vehicle Accident'
  severityDefault?: string;  // Default severity when this type is selected. Ops can override.
  requiresPhoto?: boolean;  // TRUE = photo evidence mandatory before incident can be RESOLVED
  requiresPoliceDoc?: boolean;  // TRUE = police FIR/NCR mandatory. Set for: THEFT, ACCIDENT with injury
  requiresRtoDoc?: boolean;  // TRUE = RTO order/challan mandatory. Set for: RTO_HOLD
  requiresCustomerApproval?: boolean;  // TRUE = customer must approve/acknowledge before resolution closes
  isClaimApplicable?: boolean;  // TRUE = insurance/compensation claim can be raised for this type
  autoHoldShipment?: boolean;  // TRUE = automatically put all affected LRs on HOLD status when incident created
  description?: string;  // Description of when to use this incident type
  isActive?: boolean;  // Soft active/inactive. Inactive types hidden from dropdown
  createdBy?: number;  // FK → masterdata_users.id
  updatedBy?: number;  // FK → masterdata_users.id
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id
}
