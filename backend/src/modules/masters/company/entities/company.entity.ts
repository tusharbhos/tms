// Auto-generated entity for `company` (31 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Company {
  id: number;  // PK, autoincrement
  uuid?: string;  // External API-safe public identifier. UUID4 generated on INSERT. Exposed in all REST/GraphQL APIs. Prevents sequential ID
  tenantId?: number;  // FK → tenant. Mandatory
  parentCompanyId?: number;  // Self FK — for subsidiary/franchise hierarchy
  code?: string;  // UNIQUE per tenant. Short company code e.g. COMP01
  name?: string;  // Mandatory — company display name
  nameReg?: string;  // Company name in regional language (Marathi, Hindi)
  phone1?: string;  // Primary company phone number
  phone2?: string;  // Secondary phone number
  email1?: string;  // Primary email
  email2?: string;  // Secondary email
  website?: string;  // Company website URL
  address?: string;  // Registered/operational address. Mandatory
  addressReg?: string;  // Address in regional language
  gstNum?: string;  // Company GST number
  cinNum?: string;  // CIN / MCA registration number
  panNum?: string;  // Company PAN
  tanNum?: string;  // TAN for TDS deduction
  msmeNum?: string;  // MSME number if applicable
  logoUrl?: string;  // Company logo CDN URL
  organizationId?: number;  // FK → organizations. Business group / conglomerate
  legalEntityType?: string;  // For GST filing and legal compliance
  registrationNumber?: string;  // MCA / company registration number
  active?: boolean;  // Default TRUE
  seqNum?: number;  // Sequence/display order
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
