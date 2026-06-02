// Auto-generated entity for `approval_action_logs` (18 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface ApprovalActionLogs {
  id: number;  // PK, autoincrement. BIGINT for high volume
  tenantId?: number;  // FK → masterdata_tenant.id
  requestId?: number;  // FK → approval_requests.id
  stepId?: number;  // FK → approval_steps.id. NULL for header-level actions
  actionBy?: number;  // FK → masterdata_users.id. Who performed the action
  action?: string;  // Type of action performed
  actionAt?: Date;  // Exact timestamp of action. Indexed
  remarks?: string;  // Free-text comment or reason
  previousStatus?: string;  // Status before this action
  newStatus?: string;  // Status after this action
  ipAddress?: string;  // IP of the actor. IPv4/IPv6
  deviceInfo?: string;  // Browser/device that performed action
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id. Who soft-deleted
}
