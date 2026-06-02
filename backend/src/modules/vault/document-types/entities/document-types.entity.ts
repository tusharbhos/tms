// Auto-generated entity for `document_types` (21 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface DocumentTypes {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id. NULL = system-global type
  entityType?: string;  // Entity this doc type applies to
  docCode?: string;  // Short code e.g. RC, DL, INSURANCE, GST. UNIQUE per tenant
  name?: string;  // Full document name e.g. Vehicle Registration Certificate
  nameReg?: string;  // Name in regional language. Nullable
  description?: string;  // What this document is and why it is needed
  isRequired?: boolean;  // TRUE = mandatory, entity cannot go active without this
  hasExpiry?: boolean;  // TRUE = document has an expiry date. e.g. Insurance, DL
  reminderDays?: number;  // Days before expiry to send reminder alert. 0 = no reminder
  allowsMultiple?: boolean;  // TRUE = entity can have multiple docs of this type
  acceptedFormats?: string;  // Allowed file types e.g. pdf,jpg,png. NULL = all
  maxFileSizeMb?: number;  // Max upload size in MB. NULL = platform default
  sortOrder?: number;  // Display ordering in UI
  status?: string;  // Default active
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id. Who soft-deleted
}
