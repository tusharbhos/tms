// Auto-generated entity for `api_provider_config` (26 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface ApiProviderConfig {
  id: number;  // PK autoincrement
  uuid?: string;  // External API-safe public identifier. UUID4 generated on INSERT. Exposed in all REST/GraphQL APIs. Prevents sequential ID
  tenantId?: number;  // FK → masterdata_tenant.id
  providerType?: string;  // Category of API provider
  providerName?: string;  // Provider brand name. e.g. Uffizio GPS, FASTag NHAI, MSG91 SMS, Gupshup WhatsApp, SAP S4HANA, GST Portal EWB
  providerCode?: string;  // Short unique code. e.g. UFFIZIO, MSG91, GUPSHUP, SAP_S4, GST_EWB
  baseUrl?: string;  // Base API endpoint URL
  apiKey?: string;  // API key / client ID (encrypted at rest)
  apiSecret?: string;  // API secret / client secret (encrypted at rest)
  username?: string;  // Username for basic-auth providers (e.g. GST Portal)
  password?: string;  // Password (encrypted)
  authType?: string;  // Authentication method this provider uses
  tokenEndpoint?: string;  // OAuth2 token URL (for OAUTH2 auth_type)
  webhookSecret?: string;  // HMAC secret for validating incoming webhook callbacks
  timeoutSeconds?: number;  // API call timeout. Default 30 seconds
  retryMax?: number;  // Max retries on timeout/5xx. Default 3
  extraConfig?: Record<string, any>;  // Provider-specific extra config as JSON. e.g. {"sap_company_code":"1000","sap_plant":"1001"} or {"dlt_entity_id":"...","s
  environment?: string;  // Which environment this config targets
  isActive?: boolean;  // Enable/disable this provider
  lastTestedAt?: Date;  // When connection was last successfully tested
  createdBy?: number;  // FK → masterdata_users.id
  updatedBy?: number;  // FK → masterdata_users.id
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB — ON UPDATE CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id
}
