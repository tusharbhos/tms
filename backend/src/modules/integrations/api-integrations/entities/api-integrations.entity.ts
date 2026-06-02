// Auto-generated entity for `api_integrations` (17 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface ApiIntegrations {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → tenant
  name?: string;  // Integration name e.g. GSTN API, FASTag, Uffizio GPS
  baseUrl?: string;  // API base URL
  apiKey?: string;  // API key — encrypted at rest
  authType?: string;  // Authentication mechanism
  oauthToken?: string;  // OAuth2 token — encrypted
  rateLimitPerMin?: number;  // Max requests/min to avoid throttling
  retryPolicy?: number;  // Number of retries on failure
  timeoutSeconds?: number;  // Request timeout in seconds
  active?: boolean;  // Default TRUE
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete
  deletedBy?: number;  // FK → masterdata_users.id — Who performed soft-delete
}
