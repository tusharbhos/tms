// Auto-generated entity for `print_templates` (22 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface PrintTemplates {
  id: number;  // PK autoincrement
  uuid?: string;  // External API-safe public identifier. UUID4 generated on INSERT. Exposed in all REST/GraphQL APIs. Prevents sequential ID
  tenantId?: number;  // FK → masterdata_tenant.id. NULL = system default template
  companyId?: number;  // FK → masterdata_company.id. NULL = applies to all companies
  templateType?: number;  // Type of document this template produces
  templateName?: string;  // Human name. e.g. 'Standard LR A5', 'Invoice GST Format'
  templateCode?: string;  // Short unique code. e.g. LR_STANDARD_A5, INV_GST_V1
  paperSize?: string;  // Paper size for this template
  orientation?: string;  // Page orientation
  copies?: number;  // Default number of copies to print. LR=3 (driver/consignor/consignee), Invoice=2, DRS=1
  templateHtml?: string;  // Full HTML template with Mustache variables. e.g. {{lr_no}}, {{consignor_name}}, {{total_weight}}
  variablesSchema?: Record<string, any>;  // JSON schema of all variables used in this template. Used for validation and documentation.
  includeLogo?: boolean;  // TRUE = print tenant/company logo at top
  includeStamp?: boolean;  // TRUE = include authorised signatory stamp box
  isActive?: boolean;  // Default TRUE. Inactive templates not shown in UI
  versionNo?: number;  // Template version. Increment on every HTML change.
  createdBy?: number;  // FK → masterdata_users.id
  updatedBy?: number;  // FK → masterdata_users.id
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id
}
