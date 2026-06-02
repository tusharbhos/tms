// Auto-generated entity for `currency` (15 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Currency {
  id: number;  // PK, autoincrement
  code?: string;  // ISO 4217 code e.g. INR, USD, EUR, AED. UNIQUE
  name?: string;  // Full currency name e.g. Indian Rupee
  symbol?: string;  // Display symbol e.g. ₹, $, €, £
  decimalPlaces?: number;  // Number of decimal places. INR=2, JPY=0
  symbolPosition?: string;  // Symbol placement. INR=before (₹100), some EU=after
  thousandsSeparator?: string;  // e.g. comma (,) or period (.). Default comma
  decimalSeparator?: string;  // e.g. period (.) or comma (,). Default period
  active?: boolean;  // FALSE = archived/disabled. Default TRUE
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id. Who soft-deleted
}
