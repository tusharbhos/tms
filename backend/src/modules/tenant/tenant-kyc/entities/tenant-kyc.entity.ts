// Auto-generated entity for `tenant_kyc` (99 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface TenantKyc {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → tenant. Mandatory
  legalName?: string;  // Registered legal name. Same as owner1_name for individuals
  dateOfReg?: Date;  // Date of business registration
  owner1Name?: string;  // Primary owner/director name. Mandatory
  photo1Url?: string;  // Owner 1 passport/profile photo URL
  owner1Aadhaar?: string;  // Owner 1 Aadhaar number
  owner1AadhaarUrl?: string;  // Owner 1 Aadhaar doc URL
  owner1Pan?: string;  // Owner 1 PAN number
  owner1PanUrl?: string;  // Owner 1 PAN doc URL
  owner1Email?: string;  // Owner 1 email
  owner1Mobile?: string;  // Owner 1 mobile
  owner2Name?: string;  // Secondary owner/director name. Nullable
  photo2Url?: string;  // Owner 2 photo URL
  owner2Aadhaar?: string;  // Owner 2 Aadhaar
  owner2AadhaarUrl?: string;  // Owner 2 Aadhaar doc URL
  owner2Pan?: string;  // Owner 2 PAN
  owner2PanUrl?: string;  // Owner 2 PAN doc URL
  owner2Email?: string;  // Owner 2 email
  owner2Mobile?: string;  // Owner 2 mobile
  gstNum?: string;  // GST Number
  gstCertUrl?: string;  // GST Certificate URL
  cinNum?: string;  // CIN / Company Registration Number
  companyRegCertUrl?: string;  // Company Registration Certificate URL
  panNum?: string;  // Company PAN
  panCardUrl?: string;  // PAN Card URL
  tanNum?: string;  // TAN Number (for TDS)
  tanCardUrl?: string;  // TAN Card URL
  msmeNum?: string;  // MSME Registration Number
  msmeRegCertUrl?: string;  // MSME Certificate URL
  aadhaarNum?: string;  // Company Aadhaar (for proprietorship)
  aadhaarCardUrl?: string;  // Aadhaar Card URL
  country?: string;  // Nullable
  state?: string;  // Nullable
  district?: string;  // Nullable
  taluka?: string;  // Nullable
  city?: string;  // Nullable
  pincode?: string;  // Mandatory
  address?: string;  // Registered address. Mandatory
  addressReg?: string;  // Address in regional language (Marathi, Hindi etc.)
  addrDocUrl?: string;  // Address proof document URL
  latitude?: number;  // GPS latitude of office
  longitude?: number;  // GPS longitude
  bank1Name?: string;  // Bank 1 name e.g. HDFC, SBI
  bank1AccntHolder?: string;  // Bank 1 account holder name
  bank1AccountType?: string;  // current | savings
  bank1AccountNum?: string;  // Bank 1 account number
  bank1IfscCode?: string;  // Bank 1 IFSC code
  bank1DocUrl?: string;  // Cancelled cheque / passbook URL for Bank 1
  bank2Name?: string;  // Bank 2 name. Nullable
  bank2AccntHolder?: string;  // Bank 2 account holder
  bank2AccountType?: string;  // current | savings
  bank2AccountNum?: string;  // Bank 2 account number
  bank2IfscCode?: string;  // Bank 2 IFSC code
  bank2DocUrl?: string;  // Bank 2 cancelled cheque URL
  doc1Name?: string;  // Custom document 1 name e.g. Drug Licence
  doc1Url?: string;  // Custom document 1 URL
  doc1Date?: Date;  // Document 1 issue/expiry date
  doc2Name?: string;  // Custom document 2 name
  doc2Url?: string;  // Custom document 2 URL
  doc2Date?: Date;  // Document 2 date
  doc3Name?: string;  // Custom document 3 name
  doc3Url?: string;  // Custom document 3 URL
  doc3Date?: Date;  // Document 3 date
  doc4Name?: string;  // Custom document 4 name
  doc4Url?: string;  // Custom document 4 URL
  doc4Date?: Date;  // Document 4 date
  keyPersonnel1Name?: string;  // Key contact 1 name e.g. CFO, Ops Head
  keyPersonnel1JobTitle?: string;  // Key contact 1 designation
  keyPersonnel1Mobile?: string;  // Key contact 1 mobile
  keyPersonnel1Email?: string;  // Key contact 1 email
  keyPersonnel2Name?: string;  // Key contact 2
  keyPersonnel2JobTitle?: string;  // Key contact 2 designation
  keyPersonnel2Mobile?: string;  // Key contact 2 mobile
  keyPersonnel2Email?: string;  // Key contact 2 email
  keyPersonnel3Name?: string;  // Key contact 3
  keyPersonnel3JobTitle?: string;  // Key contact 3 designation
  keyPersonnel3Mobile?: string;  // Key contact 3 mobile
  keyPersonnel3Email?: string;  // Key contact 3 email
  keyPersonnel4Name?: string;  // Key contact 4
  keyPersonnel4JobTitle?: string;  // Key contact 4 designation
  keyPersonnel4Mobile?: string;  // Key contact 4 mobile
  keyPersonnel4Email?: string;  // Key contact 4 email
  kycDate?: Date;  // Date KYC was submitted
  kycCompleted?: boolean;  // Default FALSE
  active?: boolean;  // Default TRUE
  status?: string;  // CREATED | APPROVED | REJECTED | PENDING_UPDATE | PENDING_APPROVAL
  note?: string;  // Internal reviewer notes
  verificationStatus?: string;  // Workflow state of compliance review
  verifiedBy?: number;  // FK → users. Who approved/rejected
  verifiedAt?: Date;  // Timestamp of verification decision
  expiryDate?: Date;  // KYC expiry date — trigger 30-day renewal alert
  rejectionReason?: string;  // Filled when status = rejected
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete
  deletedBy?: number;  // FK → masterdata_users.id — Who performed soft-delete
}
