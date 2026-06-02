// Auto-generated entity for `txn_pod` (36 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Pod {
  id: number;  // PK autoincrement
  uuid?: string;  // API-safe UUID
  tenantId?: number;  // FK → masterdata_tenant.id
  lrId?: number;  // FK → txn_lr.id
  drsId?: number;  // FK → txn_drs.id
  drsLrId?: number;  // FK → txn_drs_lrs.id
  podType?: string;  // How goods were delivered
  receiverName?: string;  // Name of person who received goods
  receiverMobile?: string;  // Mobile of receiver
  receiverRelation?: string;  // Receiver relation to consignee — if different person
  signatureUrl?: string;  // CDN URL of receiver digital signature
  photoUrl?: string;  // CDN URL of delivery photo — goods at consignee location
  stampUrl?: string;  // CDN URL of consignee company stamp — for corporate
  geoLatitude?: number;  // GPS latitude at time of POD capture
  geoLongitude?: number;  // GPS longitude at time of POD capture
  deliveryTime?: Date;  // Actual delivery date and time
  numPackagesDel?: number;  // Actual packages delivered
  damageStatus?: string;  // Condition of goods at delivery
  shortageQty?: number;  // Number of packages short-delivered
  excessQty?: number;  // Excess packages received
  remarks?: string;  // Driver/receiver remarks at delivery
  topayCollected?: number;  // TOPAY freight collected at delivery
  codCollected?: number;  // COD amount collected from consignee
  verified?: boolean;  // Hub/ops has verified this POD
  verifiedBy?: number;  // FK → masterdata_users.id — who verified POD
  verifiedAt?: Date;  // Verification timestamp
  invoiceTriggered?: boolean;  // TRUE = customer invoice has been created
  otpVerified?: boolean;  // Whether consignee OTP was used to confirm receipt. Linked to txn_drs_lrs.otp_verified for the same delivery. TRUE = high
  podVerificationStatus?: string;  // Hub/ops verification state of this POD. PENDING = uploaded, awaiting review. VERIFIED = approved, invoice triggered. REJ
  podRejectReasonId?: number;  // FK → masterdata_reason_master.id (module=pod, reason_type=reject). Required when pod_verification_status=REJECTED or ON_
  createdBy?: number;  // FK → masterdata_users.id — Who created this record
  updatedBy?: number;  // FK → masterdata_users.id — Who last updated
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
  deletedAt?: Date;  // Soft-delete timestamp. NULL = active POD. Set on cancel/override.
}

export const PodStatuses = ["UPLOADED", "PENDING_VERIFY", "VERIFIED", "REJECTED", "RE_UPLOADED", "ON_HOLD", "INVOICE_TRIGGERED"] as const;
export type PodStatus = (typeof PodStatuses)[number];

export const PodTransitions: Record<string, string[]> = {
  "UPLOADED": [
    "PENDING_VERIFY"
  ],
  "PENDING_VERIFY": [
    "VERIFIED",
    "REJECTED",
    "ON_HOLD"
  ],
  "VERIFIED": [
    "INVOICE_TRIGGERED"
  ],
  "REJECTED": [
    "RE_UPLOADED"
  ],
  "RE_UPLOADED": [
    "PENDING_VERIFY"
  ],
  "ON_HOLD": [
    "PENDING_VERIFY"
  ],
  "INVOICE_TRIGGERED": []
};
