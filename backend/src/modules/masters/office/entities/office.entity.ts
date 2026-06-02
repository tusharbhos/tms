// Auto-generated entity for `office` (34 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Office {
  id: number;  // PK, autoincrement
  uuid?: string;  // External API-safe public identifier. UUID4 generated on INSERT. Exposed in all REST/GraphQL APIs. Prevents sequential ID
  tenantId?: number;  // FK → tenant. Mandatory
  companyTag?: number;  // FK → company. Nullable
  parentOfficeId?: number;  // Self FK — creates hierarchy: HO → Region → Hub → Branch
  code?: string;  // UNIQUE per tenant. e.g. PNQ-01, MUM-HUB
  name?: string;  // Mandatory — office display name
  nameReg?: string;  // Office name in regional language
  oType?: string;  // HQ | REG_HQ | BACK_OFFICE | BRANCH | HUB | WAREHOUSE
  officeLevel?: number;  // Depth: 1=HO, 2=Region, 3=Hub, 4=Branch, 5=Depot
  gstNum?: string;  // Office GST (if separate GSTIN)
  cinNum?: string;  // CIN if applicable
  owned?: boolean;  // TRUE = own office. FALSE = rented/CP location
  cpKycId?: number;  // FK → cp_kyc. Links channel partner KYC for this office
  country?: string;  // Nullable
  state?: string;  // Nullable
  district?: string;  // Nullable
  taluka?: string;  // Nullable
  city?: string;  // Nullable
  pincode?: string;  // Mandatory
  address?: string;  // Mandatory — full office address
  addressReg?: string;  // Address in regional language
  latitude?: number;  // GPS latitude
  longitude?: number;  // GPS longitude
  geoZoneId?: number;  // FK → geo_hierarchy for zone-based freight mapping
  capacityPackages?: number;  // Warehouse capacity in packages
  active?: boolean;  // Default TRUE
  description?: string;  // Notes about this office
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
