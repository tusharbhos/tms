// Auto-generated entity for `documents` (20 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Documents {
  id: number;  // PK, autoincrement
  uuid?: string;  // External API-safe public identifier. UUID4 generated on INSERT. Exposed in all REST/GraphQL APIs. Prevents sequential ID
  tenantId?: number;  // FK → tenant
  entityType?: string;  // Polymorphic: 'vehicle','driver','customer','vendor','invoice','kyc'…
  entityId?: number;  // ID of the linked entity record
  documentTypeId?: number;  // FK → document_types. What kind of doc this is
  fileName?: string;  // Original filename as uploaded
  fileUrl?: string;  // CDN / S3 URL. Mandatory
  mimeType?: string;  // application/pdf, image/jpeg, image/png…
  fileSizeKb?: number;  // File size for storage management
  documentVersion?: number;  // Increment on re-upload to maintain history
  expiryDate?: Date;  // Document validity expiry — triggers renewal alert
  uploadedBy?: number;  // FK → users. Who uploaded this document
  active?: boolean;  // Default TRUE
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
