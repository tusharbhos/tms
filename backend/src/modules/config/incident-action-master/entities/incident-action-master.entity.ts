// Auto-generated entity for `incident_action_master` (16 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface IncidentActionMaster {
  id: number;  // PK autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id. NULL = global action
  incidentTypeId?: number;  // FK → incident_type_master.id — which incident this action applies to. NULL = applicable to all.
  actionCode?: string;  // Unique action code. e.g. ARRANGE_NEW_VEHICLE, INFORM_CUSTOMER, INFORM_POLICE, CREATE_CLAIM, HOLD_SHIPMENT, RE_ROUTE_SHIP
  actionName?: string;  // Display name. e.g. 'Arrange Replacement Vehicle'
  description?: string;  // What this action involves
  defaultSlaHours?: number;  // Default SLA hours to complete this action. e.g. ARRANGE_NEW_VEHICLE=2hr, INFORM_CUSTOMER=0.5hr
  isMandatory?: boolean;  // TRUE = cannot resolve incident without this action being COMPLETED
  sequenceOrder?: number;  // Display order in action checklist
  isActive?: boolean;  // Default TRUE
  createdBy?: number;  // FK → masterdata_users.id
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
}
