// Auto-generated entity for `txn_claims` (24 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Claims {
  id: number;  // PK autoincrement
  uuid?: string;  // External API-safe UUID
  claimNo?: string;  // Auto-generated claim number. e.g. CLM-2526-000001
  tenantId?: number;  // FK → masterdata_tenant.id
  incidentId?: number;  // FK → txn_incidents.id — parent incident
  lrId?: number;  // FK → txn_lr.id — primary LR for the claim
  customerId?: number;  // FK → masterdata_customer.id — claimant
  claimReason?: string;  // Reason for claim. e.g. 'Product damaged in transit due to accident on NH48'
  claimAmount?: number;  // Amount claimed by customer (based on invoice value)
  approvedAmount?: number;  // Amount approved by ops/insurer (may be less than claimed)
  settledAmount?: number;  // Actual amount paid to customer
  claimStatus?: string;  // Claim lifecycle status
  reviewedBy?: number;  // FK → masterdata_users.id — finance/ops who reviewed
  approvedBy?: number;  // FK → masterdata_users.id — who approved the claim
  approvedAt?: Date;  // Claim approval timestamp
  settledAt?: Date;  // Payment settlement timestamp
  rejectionReason?: string;  // Reason for rejection if claim_status=REJECTED
  remarks?: string;  // Internal ops notes on claim processing
  createdBy?: number;  // FK → masterdata_users.id
  updatedBy?: number;  // FK → masterdata_users.id
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id
}
