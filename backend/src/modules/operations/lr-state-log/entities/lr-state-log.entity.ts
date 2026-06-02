// Auto-generated entity for `txn_lr_state_log` (12 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface LrStateLog {
  id: number;  // PK autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id
  lrId?: number;  // FK → txn_lr.id
  fromStatus?: string;  // Previous status
  toStatus?: string;  // New status — from status_master
  changedBy?: number;  // FK → masterdata_users.id — who triggered status change
  changedAt?: Date;  // When status changed
  remarks?: string;  // Reason for status change
  triggerEntity?: string;  // What triggered the change: manifest, drs, pod, system
  triggerId?: number;  // ID of triggering entity
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
}
