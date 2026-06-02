// Auto-generated entity for `txn_status_change_logs` (15 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface StatusChangeLogs {
  id: number;  // PK — Auto-increment. Immutable log. Never delete.
  tenantId?: number;  // FK → masterdata_tenant.id. Mandatory.
  entityType?: string;  // Which entity changed status. lr, booking, trip, manifest, drs, pod, invoice, prn.
  entityId?: number;  // Primary key of the entity that changed status.
  entityCode?: string;  // Denormalized display code (lr_no, booking_no, trip_no). Avoids JOIN for display.
  oldStatus?: string;  // Status BEFORE this change. NULL for first status (entity creation).
  newStatus?: string;  // Status AFTER this change.
  changedBy?: number;  // FK → masterdata_users.id — Who triggered this change.
  changedAt?: Date;  // Exact datetime of the status change event.
  remarks?: string;  // Reason or context for status change. e.g. "DRS closed", "POD rejected by ops".
  systemGenerated?: boolean;  // TRUE = auto-transition by status_automation_rules. FALSE = manual by user.
  triggerSource?: string;  // What triggered this change. DRIVER_APP, HUB_SCAN, SYSTEM_RULE, MANUAL_OPS, API_WEBHOOK.
  triggerRefId?: number;  // ID of the record that caused this change. e.g. drs_id, pod_id, manifest_id.
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP. IMMUTABLE.
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
}
