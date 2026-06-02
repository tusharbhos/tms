// Auto-generated entity for `tenant` (24 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Tenant {
  id: number;  // PK, autoincrement
  name?: string;  // Mandatory — Display name of the tenant
  code?: string;  // Short tenant code e.g. TMS001. Used in LR prefix, reports
  uuid?: string;  // UNIQUE — External/public safe ID. Prevents sequential ID scraping
  timezone?: string;  // e.g. Asia/Kolkata. Required for multi-country SaaS
  languageCode?: string;  // e.g. en, hi, mr. For UI localisation
  logoUrl?: string;  // CDN URL of tenant logo
  description?: string;  // Nullable
  country?: string;  // Nullable
  state?: string;  // Nullable
  city?: string;  // Nullable
  pincode?: string;  // Mandatory
  address?: string;  // Nullable
  latitude?: number;  // GPS coordinate
  longitude?: number;  // GPS coordinate
  currencyId?: number;  // FK → currencies. Default billing currency
  active?: boolean;  // Default TRUE
  status?: string;  // Replaces boolean active; adds suspended state
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete timestamp
  deletedBy?: number;  // FK → users. Who soft-deleted
}
