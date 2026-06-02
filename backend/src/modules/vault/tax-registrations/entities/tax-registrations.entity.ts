// Auto-generated entity for `tax_registrations` (26 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface TaxRegistrations {
  id: number;  // PK, autoincrement
  uuid?: string;  // External API-safe public identifier. UUID4 generated on INSERT. Exposed in all REST/GraphQL APIs. Prevents sequential ID
  tenantId?: number;  // FK → masterdata_tenant.id
  entityType?: string;  // Entity this registration belongs to
  entityId?: number;  // PK of the entity (polymorphic FK)
  regType?: string;  // Type of registration/compliance number
  regNumber?: string;  // The actual registration number. Encrypted for Aadhaar
  regName?: string;  // Name as it appears on the registration. Nullable
  state?: string;  // State of registration (for GST). Nullable
  regDate?: Date;  // Date of registration/issuance
  expiryDate?: Date;  // Expiry date if applicable (Drug Licence, FSSAI). NULL = non-expiring
  docUrl?: string;  // URL of the registration certificate/document
  docTypeId?: number;  // FK → masterdata_document_types.id. Nullable
  isPrimary?: boolean;  // TRUE = main registration of this type for entity
  verificationStatus?: string;  // Verification outcome
  verifiedAt?: Date;  // Timestamp of verification
  verifiedBy?: number;  // FK → masterdata_users.id. Null = API verification
  rejectionReason?: string;  // Reason for rejection. NULL on success
  reminderDays?: number;  // Days before expiry to alert. 0 = no reminder
  status?: string;  // Default active
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
