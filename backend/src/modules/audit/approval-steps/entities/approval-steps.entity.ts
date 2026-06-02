// Auto-generated entity for `approval_steps` (21 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface ApprovalSteps {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id
  requestId?: number;  // FK → approval_requests.id
  stepNumber?: number;  // Step sequence 1, 2, 3…
  stepName?: string;  // Label e.g. "Branch Manager Review"
  approverType?: string;  // Whether approval is by a specific user or any user of a role
  approverUserId?: number;  // FK → masterdata_users.id. NULL if approver_type=role
  approverRoleId?: number;  // FK → masterdata_role.id. NULL if approver_type=user
  assignedAt?: Date;  // When this step became active
  dueAt?: Date;  // SLA deadline for this step. Nullable
  actedBy?: number;  // FK → masterdata_users.id. Who actually acted. NULL=pending
  action?: string;  // Decision made on this step
  actedAt?: Date;  // Timestamp of action. NULL = not yet acted
  remarks?: string;  // Approver remarks/comments
  status?: string;  // waiting=future step, active=current, completed=done
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id. Who soft-deleted
}
