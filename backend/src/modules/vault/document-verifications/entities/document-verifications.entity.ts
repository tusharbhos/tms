// Auto-generated entity for `document_verifications` (19 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface DocumentVerifications {
  id: number;  // PK, autoincrement. BIGINT — immutable append-only log
  tenantId?: number;  // FK → masterdata_tenant.id
  documentId?: number;  // FK → masterdata_documents.id. Mandatory
  documentTypeId?: number;  // FK → masterdata_document_types.id. Denormalised for speed
  entityType?: string;  // Denormalised entity type for quick filtering
  entityId?: number;  // Denormalised entity ID for quick filtering
  action?: string;  // What action was performed in this step
  actionBy?: number;  // FK → masterdata_users.id. Who performed the action
  actionAt?: Date;  // Timestamp of action. Indexed
  remarks?: string;  // Checker remarks, rejection reason, or query message
  previousStatus?: string;  // Document status before this action
  newStatus?: string;  // Document status after this action
  docUrlSnapshot?: string;  // URL of document at time of this review (immutable snapshot)
  expiryDate?: Date;  // Expiry date recorded at time of verification. Nullable
  verificationMethod?: string;  // How verification was performed
  ipAddress?: string;  // IP of the checker. Nullable
  approvalRequestId?: number;  // FK → approval_requests.id if part of workflow. Nullable
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
}
