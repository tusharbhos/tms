// Auto-generated entity for `workflow_master` (16 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface WorkflowMaster {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → tenant
  name?: string;  // e.g. Vehicle Approval Workflow, KYC Review
  module?: string;  // Which module triggers this: vehicles, kyc, contract…
  approvalType?: string;  // sequential=all in order, parallel=all at once, any_one=first to act wins
  escalationHours?: number;  // SLA: if no action in N hours, escalate
  autoApprovalHours?: number;  // If > 0 and no action in N hours after escalation, auto-approve. 0 = disabled. Enterprise SLA compliance feature.
  escalationUserId?: number;  // FK → users. Who gets escalation notification
  description?: string;  // Business purpose of this workflow
  active?: boolean;  // Default TRUE
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
