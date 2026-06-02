// Auto-generated entity for `customer` (48 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Customer {
  id: number;  // PK, autoincrement
  uuid?: string;  // UNIQUE — External/API-safe identifier. Prevents sequential ID scraping. Generated on INSERT.
  tenantId?: number;  // FK → tenant
  companyTag?: number;  // FK → company
  parentId?: number;  // Self FK — parent customer for group accounts
  primaryServicingOfficeId?: number;  // FK → office (HUB type). Primary servicing hub
  code?: string;  // UNIQUE per tenant. e.g. CUST-PNQ-001
  name?: string;  // Mandatory — customer name
  nameReg?: string;  // Customer name in regional language
  cType?: string;  // CONTRACTUAL | RETAIL
  cSubtype?: string;  // CONSIGNOR | CONSIGNEE
  customerType?: string;  // Detailed segmentation for pricing
  customerGroup?: string;  // e.g. Gold, Silver, Enterprise — for tiered pricing
  industryType?: string;  // Industry: Pharma, Auto, FMCG, Textile…
  paymentTypes?: Record<string, any>;  // Allowed payment types: TBB, TOPAY, PAID, COD
  mobile?: string;  // Primary contact mobile
  telNum?: string;  // Landline number
  email?: string;  // Primary email
  billingContactPerson?: string;  // Billing department contact name
  billingMobile?: string;  // Billing contact mobile. Mandatory
  billingEmail?: string;  // Billing contact email. Mandatory
  billingAddress?: string;  // Billing address. Mandatory
  billingAddressReg?: string;  // Billing address in regional language
  country?: string;
  state?: string;
  district?: string;
  taluka?: string;
  city?: string;  // Mandatory
  pincode?: string;  // Mandatory
  address?: string;
  addressReg?: string;  // Regional language address
  latitude?: number;
  longitude?: number;
  panNum?: string;  // For TDS and invoice compliance
  gstNum?: string;  // Customer GST
  creditLimit?: number;  // Max outstanding before orders blocked
  paymentTerms?: string;  // NET30, ADVANCE, COD
  billingCycle?: string;  // Invoice generation frequency
  accountManagerId?: number;  // FK → users. Relationship owner
  otherServicingOffices?: Record<string, any>;  // Array of hub office IDs also servicing this customer
  erpEntryDate?: Date;  // Customer creation date in ERP like SAP
  active?: boolean;  // Default TRUE
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
