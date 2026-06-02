// Auto-generated entity for `addresses` (25 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface Addresses {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → masterdata_tenant.id. Mandatory
  entityType?: string;  // Type of entity this address belongs to
  entityId?: number;  // PK of the entity row (polymorphic FK)
  addressType?: string;  // Category of this address
  addressLine1?: string;  // Street / flat / building line
  addressLine2?: string;  // Locality / landmark. Nullable
  city?: string;  // City name
  district?: string;  // District / county
  state?: string;  // State / province
  pincode?: string;  // Postal / ZIP code
  country?: string;  // ISO country name. Default India
  latitude?: number;  // GPS latitude. Used for distance calc & map display
  longitude?: number;  // GPS longitude
  isPrimary?: boolean;  // TRUE = default address for entity. Only 1 per entity_type
  geoHierarchyId?: number;  // FK → masterdata_geo_hierarchy.id. Optional linkage
  addressReg?: string;  // Address in regional language (Marathi / Hindi). Nullable
  proofDocUrl?: string;  // URL of address proof document
  status?: string;  // Default active
  createdBy?: number;  // FK → masterdata_users.id. Who created
  updatedBy?: number;  // FK → masterdata_users.id. Who last updated
  createdAt: Date;  // Auto-set by DB on insert
  updatedAt: Date;  // Auto-set by DB on update
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id. Who soft-deleted
}
