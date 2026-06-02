// Auto-generated entity for `txn_incident_actions` (17 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface IncidentActions {
  id: number;  // PK autoincrement
  uuid?: string;  // External API-safe identifier. UUID4 generated on INSERT trigger. Used in all REST API URLs and mobile app references. Ne
  tenantId?: number;  // FK → masterdata_tenant.id
  incidentId?: number;  // FK → txn_incidents.id
  actionType?: string;  // Action type code from incident_action_master. e.g. ARRANGE_NEW_VEHICLE, INFORM_CUSTOMER, CREATE_CLAIM
  actionStatus?: string;  // Status of this specific action
  assignedTo?: number;  // FK → masterdata_users.id — who must complete this action
  dueAt?: Date;  // When this action must be completed
  completedAt?: Date;  // Actual completion timestamp
  remarks?: string;  // Notes on how the action was completed
  completedBy?: number;  // FK → masterdata_users.id — who completed the action
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
