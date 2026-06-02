// Auto-generated entity for `channel_partner` (35 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface ChannelPartner {
  id: number;  // PK, autoincrement
  uuid?: string;  // External API-safe public identifier. UUID4 generated on INSERT. Exposed in all REST/GraphQL APIs. Prevents sequential ID
  tenantId?: number;  // FK → tenant
  companyId?: number;  // FK → company
  officeId?: number;  // FK → office. Servicing branch
  parentCpId?: number;  // Self FK — Master CP → Sub-CP hierarchy
  cpCode?: string;  // UNIQUE CP code for reporting e.g. CP-PNQ-001
  name?: string;  // CP firm/individual name
  contactPerson?: string;  // Primary contact person name
  mobile?: string;  // Primary contact mobile
  email?: string;  // Login/communication email
  cpType?: string;  // Business structure type
  gstNumber?: string;  // For GST on commission payouts
  panNumber?: string;  // For TDS compliance
  agreementNumber?: string;  // Contract reference number
  agreementStartDate?: Date;  // Contract start
  agreementEndDate?: Date;  // Contract expiry — 30-day renewal alert
  autoRenewal?: boolean;  // Auto-renew on expiry
  commissionType?: string;  // How commission is computed
  commissionValue?: number;  // Flat amount or % rate
  paymentCycle?: string;  // Commission payout frequency
  creditLimit?: number;  // Max unpaid bookings allowed
  creditDays?: number;  // Credit period in days
  rating?: number;  // 0.00–5.00 performance score
  assignedUserId?: number;  // FK → users. Account manager
  status?: string;  // Operational status
  onboardingStatus?: string;  // Onboarding workflow state
  blacklistReason?: string;  // Filled when blacklisted
  isActive?: boolean;  // Default TRUE. Soft-enable/disable without deleting
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
