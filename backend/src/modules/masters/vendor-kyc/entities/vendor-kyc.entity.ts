// Auto-generated entity for `vendor_kyc` (93 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface VendorKyc {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → tenant
  vendorId?: number;  // FK → vendor. Mandatory
  vType?: string;  // FUEL_VENDOR | FLEET_VENDOR | LOADER | DRIVER | OTHERS
  legalName?: string;  // Registered name. Same as owner1_name for individual
  owner1Name?: string;  // Primary owner/director. Mandatory
  photo1Url?: string;  // Owner 1 photo URL
  owner1Aadhaar?: string;  // Owner 1 Aadhaar
  owner1AadhaarUrl?: string;  // Owner 1 Aadhaar doc
  owner1Pan?: string;  // Owner 1 PAN
  owner1PanUrl?: string;  // Owner 1 PAN doc
  owner1Email?: string;  // Owner 1 email
  owner1Mobile?: string;  // Owner 1 mobile
  owner2Name?: string;  // Secondary owner. Nullable
  photo2Url?: string;
  owner2Aadhaar?: string;
  owner2AadhaarUrl?: string;
  owner2Pan?: string;
  owner2PanUrl?: string;
  owner2Email?: string;
  owner2Mobile?: string;
  dlNum?: string;  // Driving Licence number
  dlIssueDate?: Date;  // DL issue date
  dlExpiryDate?: Date;  // DL expiry — 30-day alert
  dlIssueRto?: string;  // RTO that issued the DL
  dlCardUrl?: string;  // DL document URL
  country?: string;
  state?: string;
  district?: string;
  taluka?: string;
  city?: string;
  pincode?: string;  // Mandatory
  address?: string;  // Mandatory
  addressReg?: string;  // Regional language address
  addrDocUrl?: string;  // Address proof doc
  latitude?: number;
  longitude?: number;
  gstNum?: string;
  gstCertUrl?: string;
  cinNum?: string;
  companyRegCertUrl?: string;
  panNum?: string;
  panCardUrl?: string;
  tanNum?: string;
  tanCardUrl?: string;
  msmeNum?: string;
  msmeRegCertUrl?: string;
  aadhaarNum?: string;
  aadhaarCardUrl?: string;
  bank1Name?: string;
  bank1AccntHolder?: string;
  bank1AccountType?: string;  // current | savings
  bank1AccountNum?: string;
  bank1IfscCode?: string;
  bank1DocUrl?: string;
  bank2Name?: string;  // Nullable
  bank2AccntHolder?: string;
  bank2AccountType?: string;  // current | savings
  bank2AccountNum?: string;
  bank2IfscCode?: string;
  bank2DocUrl?: string;
  doc1Name?: string;
  doc1Url?: string;
  doc1Date?: Date;
  doc2Name?: string;
  doc2Url?: string;
  doc2Date?: Date;
  doc3Name?: string;
  doc3Url?: string;
  doc3Date?: Date;
  doc4Name?: string;
  doc4Url?: string;
  doc4Date?: Date;
  keyPersonnel1Name?: string;
  keyPersonnel1JobTitle?: string;
  keyPersonnel1Mobile?: string;
  keyPersonnel1Email?: string;
  keyPersonnel2Name?: string;
  keyPersonnel2JobTitle?: string;
  keyPersonnel2Mobile?: string;
  keyPersonnel2Email?: string;
  dateOfReg?: Date;  // Business registration date
  verificationStatus?: string;
  verifiedBy?: number;  // FK → users
  verifiedAt?: Date;
  expiryDate?: Date;  // KYC expiry for renewal
  isActive?: boolean;  // Default TRUE. Soft-enable/disable without deleting
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
