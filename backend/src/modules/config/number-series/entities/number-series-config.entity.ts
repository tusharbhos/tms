// Auto-generated entity for `number_series_config` (20 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface NumberSeriesConfig {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id — Mandatory
  companyId?: number;  // FK → masterdata_company.id — NULL = applies to all companies under tenant
  entityType?: string;  // Which document type this series is for
  prefix?: string;  // e.g. BKG, LR, INV, MFT, TRP. Mandatory
  financialYear?: string;  // e.g. 2526 (FY 2025-26). Recalculated on reset. Mandatory
  currentRunningNo?: number;  // Last used number. Next number = current_running_no + 1. Default 0
  minDigits?: number;  // Zero-pad length. Default 6 → 000001. Range 4–9
  suffix?: string;  // Optional suffix appended after number e.g. -MH. Nullable
  separator?: string;  // Separator char between parts. Default '-'
  resetType?: string;  // YEARLY = reset on Apr 1 | MONTHLY = reset on 1st | NEVER = continuous
  lastResetAt?: Date;  // When the counter was last reset to 0. Nullable
  isActive?: boolean;  // Default TRUE. Disable to freeze number generation for this series
  exampleOutput?: string;  // Read-only documentation field. e.g. BKG-2526-000001. Informational only
  createdBy?: number;  // FK → masterdata_users.id
  updatedBy?: number;  // FK → masterdata_users.id
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
