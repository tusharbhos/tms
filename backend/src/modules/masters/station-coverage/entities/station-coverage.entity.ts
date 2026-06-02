// Auto-generated entity for `station_coverage` (35 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface StationCoverage {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → tenant
  servicingOfficeId?: number;  // FK → office. Hub that services this pincode
  name?: string;  // Station/locality name. Mandatory
  nameReg?: string;  // Name in regional language
  postName?: string;  // Post office name
  postNameReg?: string;  // Post office name in regional language
  pincode?: string;  // Pincode. Mandatory
  taluka?: string;  // Nullable
  talukaReg?: string;  // Taluka in regional language
  district?: string;  // Mandatory
  districtReg?: string;  // District in regional language
  state?: string;  // Mandatory
  stateReg?: string;  // State in regional language
  country?: string;  // Mandatory
  latitude?: number;
  longitude?: number;
  nameGmap?: string;  // Name as appears in Google Maps
  serviceOfficeTat?: number;  // Transit time in days from hub to this station
  servicingOfficeDist?: number;  // Distance in KM from servicing hub
  zone?: string;  // Freight zone code e.g. A, B, C, ODA
  routeNum?: string;  // Route number servicing this station
  routeSequence?: number;  // Stop sequence on the route
  oda?: boolean;  // Default FALSE. TRUE = Out of Delivery Area
  nrStateHighway?: string;  // Nearest state highway
  nrNationalHighway?: string;  // Nearest national highway
  active?: boolean;  // Default TRUE
  status?: string;  // CREATED | APPROVED | REJECTED | PENDING_UPDATE | PENDING_APPROVAL
  note?: string;  // Internal notes
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
