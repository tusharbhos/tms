// Auto-generated entity for `vendor` (27 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Vendor {
  id: number;  // PK, autoincrement
  uuid?: string;  // UNIQUE — External/API-safe identifier. Prevents sequential ID scraping. Generated on INSERT.
  tenantId?: number;  // FK → tenant
  companyTag?: number;  // FK → company
  contractingOfficeId?: number;  // FK → office. Which branch manages this vendor
  code?: string;  // UNIQUE per tenant. Vendor code
  name?: string;  // Mandatory — vendor display name
  nameReg?: string;  // Name in regional language
  legalName?: string;  // Registered legal name
  legalNameReg?: string;  // Legal name in regional language
  erpCode?: string;  // Code in external ERP (SAP, Tally)
  vType?: string;  // FUEL_VENDOR | FLEET_VENDOR | LOADER | DRIVER | OTHERS
  vendorCategory?: number;  // Detailed category
  mobile?: string;  // Mandatory — primary contact
  email?: string;  // Nullable
  vendorRating?: number;  // 0.00–5.00 performance rating
  paymentTerms?: string;  // NET15, NET30, ADVANCE
  contractId?: number;  // FK → partner_contract
  active?: boolean;  // Default FALSE (requires approval)
  blacklistedFlag?: boolean;  // Compliance block by management
  blacklistReason?: string;  // Reason for blacklisting
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
