// Auto-generated entity for `cp_kyc` (84 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface CpKyc {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → tenant
  companyTag?: number;  // FK → company
  cpId?: number;  // FK → channel_partner table
  legalName?: string;  // Registered name. Same as owner1_name for individuals
  dateOfReg?: Date;  // Date of business registration
  owner1Name?: string;  // Primary owner name. Mandatory
  photo1Url?: string;  // Owner 1 photo URL
  owner1Aadhaar?: string;  // Owner 1 Aadhaar
  owner1AadhaarUrl?: string;  // Owner 1 Aadhaar doc
  owner1Pan?: string;  // Owner 1 PAN
  owner1PanUrl?: string;  // Owner 1 PAN doc
  owner1Email?: string;  // Owner 1 email
  owner1Mobile?: string;  // Owner 1 mobile
  owner2Name?: string;  // Secondary owner. Nullable
  photo2Url?: string;  // Owner 2 photo
  owner2Aadhaar?: string;  // Owner 2 Aadhaar
  owner2AadhaarUrl?: string;  // Owner 2 Aadhaar doc
  owner2Pan?: string;  // Owner 2 PAN
  owner2PanUrl?: string;  // Owner 2 PAN doc
  owner2Email?: string;  // Owner 2 email
  owner2Mobile?: string;  // Owner 2 mobile
  country?: string;
  state?: string;
  district?: string;
  taluka?: string;
  city?: string;
  pincode?: string;  // Mandatory
  address?: string;  // Mandatory
  addressReg?: string;  // Regional language address
  addrDocUrl?: string;  // Address proof doc URL
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
  bank1DocUrl?: string;  // Cancelled cheque URL
  bank2Name?: string;  // Nullable
  bank2AccntHolder?: string;
  bank2AccountType?: string;  // current | savings
  bank2AccountNum?: string;
  bank2IfscCode?: string;
  bank2DocUrl?: string;
  doc1Name?: string;  // e.g. Drug Licence, FSSAI, Import Licence
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
  kycCompleted?: boolean;  // Default FALSE
  active?: boolean;  // Default TRUE
  status?: string;  // CREATED | APPROVED | REJECTED | PENDING_UPDATE | PENDING_APPROVAL
  note?: string;  // Reviewer notes
  verificationStatus?: string;  // Compliance workflow state
  verifiedBy?: number;  // FK → users
  verifiedAt?: Date;  // Verification timestamp
  expiryDate?: Date;  // KYC renewal date
  rejectionReason?: string;  // Reason for rejection
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete
  deletedBy?: number;  // FK → masterdata_users.id — Who performed soft-delete
}
