// Auto-generated entity for `approval_requests` (22 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface ApprovalRequests {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id
  workflowId?: number;  // FK → masterdata_workflow_master.id. Defines step sequence
  entityType?: string;  // What type of record needs approval
  entityId?: number;  // PK of the entity record being approved
  referenceCode?: string;  // Human-readable ref e.g. VEH-APR-2025-001
  requestedBy?: number;  // FK → masterdata_users.id. Who submitted for approval
  requestedAt?: Date;  // Submission timestamp
  currentStep?: number;  // Which step is currently pending (step number)
  totalSteps?: number;  // Total steps in this workflow
  status?: string;  // Overall approval status
  priority?: string;  // Urgency flag. Default normal
  dueDate?: Date;  // SLA deadline for final approval. Nullable
  remarks?: string;  // Final remarks after approval/rejection
  completedAt?: Date;  // When final decision was made (approved/rejected)
  completedBy?: number;  // FK → masterdata_users.id. Final approver
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id. Who soft-deleted
}
