// Auto-generated entity for `bank_accounts` (30 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface BankAccounts {
  id: number;  // PK, autoincrement
  uuid?: string;  // External API-safe public identifier. UUID4 generated on INSERT. Exposed in all REST/GraphQL APIs. Prevents sequential ID
  tenantId?: number;  // FK → masterdata_tenant.id
  entityType?: string;  // Entity this account belongs to
  entityId?: number;  // PK of the entity (polymorphic FK)
  accountLabel?: string;  // User-given label e.g. "Primary HDFC", "Salary SBI". Nullable
  accountHolder?: string;  // Name on the account. Must match bank records
  accountNumber?: string;  // Bank account number. Encrypted at rest
  accountType?: string;  // Type of bank account
  bankName?: string;  // Bank name e.g. HDFC, SBI, ICICI, Axis
  bankCode?: string;  // Bank short code / BIC. Nullable
  ifscCode?: string;  // IFSC code. 11 chars. Used for NEFT/RTGS/IMPS
  branchName?: string;  // Bank branch name. Nullable
  branchAddress?: string;  // Bank branch address. Nullable
  micrCode?: string;  // MICR code. 9 digits. Used for cheque processing
  cancelledChequeUrl?: string;  // URL of cancelled cheque / passbook image
  isPrimary?: boolean;  // TRUE = default payout/collection account
  isNachEnabled?: boolean;  // TRUE = NACH eMandate active for auto-debit
  nachRef?: string;  // NACH mandate reference number. Nullable
  verificationStatus?: string;  // Penny-drop or manual verification status
  verifiedAt?: Date;  // Timestamp of verification. NULL = not yet verified
  verifiedBy?: number;  // FK → masterdata_users.id. NULL = auto-verified (penny drop)
  rejectionReason?: string;  // Reason if verification_status=rejected
  status?: string;  // Default active
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
