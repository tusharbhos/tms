// Auto-generated entity for `txn_incident_documents` (19 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface IncidentDocuments {
  id: number;  // PK autoincrement
  uuid?: string;  // External API-safe identifier. UUID4 generated on INSERT trigger. Used in all REST API URLs and mobile app references. Ne
  tenantId?: number;  // FK → masterdata_tenant.id
  incidentId?: number;  // FK → txn_incidents.id — parent incident
  documentType?: string;  // Type of document uploaded
  fileUrl?: string;  // S3/CDN URL of uploaded file
  fileName?: string;  // Original filename
  fileSizeKb?: number;  // File size in KB — for storage monitoring
  remarks?: string;  // Notes about this document
  uploadedBy?: number;  // FK → masterdata_users.id — who uploaded
  uploadedAt?: Date;  // Upload timestamp
  verifiedBy?: number;  // FK → masterdata_users.id — ops staff who verified the document
  verifiedAt?: Date;  // Verification timestamp
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
