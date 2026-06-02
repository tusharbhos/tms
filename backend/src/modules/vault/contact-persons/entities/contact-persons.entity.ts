// Auto-generated entity for `contact_persons` (29 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface ContactPersons {
  id: number;  // PK, autoincrement
  uuid?: string;  // External API-safe public identifier. UUID4 generated on INSERT. Exposed in all REST/GraphQL APIs. Prevents sequential ID
  tenantId?: number;  // FK → masterdata_tenant.id. Mandatory
  entityType?: string;  // Entity this contact belongs to
  entityId?: number;  // PK of the entity row (polymorphic FK)
  contactType?: string;  // Role/purpose of this contact
  salutation?: string;  // Title. Nullable
  name?: string;  // Full name of the contact person. Mandatory
  designation?: string;  // Job title / designation e.g. CFO, Logistics Head
  department?: string;  // Department e.g. Finance, Operations. Nullable
  mobile?: string;  // Primary mobile number. Mandatory
  mobile2?: string;  // Alternate mobile. Nullable
  email?: string;  // Primary email. Mandatory
  email2?: string;  // Alternate email. Nullable
  phone?: string;  // Landline with STD code. Nullable
  whatsapp?: string;  // WhatsApp number if different from mobile. Nullable
  isPrimary?: boolean;  // TRUE = main contact for entity. Only 1 per entity
  receivesInvoice?: boolean;  // TRUE = send invoices/statements to this contact
  receivesAlerts?: boolean;  // TRUE = send shipment/alert notifications
  canLogin?: boolean;  // TRUE = this contact can get portal access. Links to masterdata_users
  userId?: number;  // FK → masterdata_users.id. NULL if can_login=FALSE
  notes?: string;  // Internal notes about this contact
  status?: string;  // Default active
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
