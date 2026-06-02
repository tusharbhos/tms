// Auto-generated entity for `geo_hierarchy` (21 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface GeoHierarchy {
  id: number;  // PK, autoincrement
  country?: string;  // Country name. Mandatory
  state?: string;  // State name. Mandatory
  district?: string;  // District name. Mandatory
  city?: string;  // City name for booking routing. e.g. Pune, Nagpur. Bridges district → taluka for urban areas. Mandatory for metro pincode
  zone?: string;  // Freight zone name e.g. WEST, NORTH, METRO-MH. Used in zone-based pricing and hub assignment. Nullable.
  taluka?: string;  // Taluka/Tehsil name. Mandatory
  poName?: string;  // Post Office name. Mandatory
  pincode?: string;  // Pincode. Mandatory
  poLat?: number;  // Post Office latitude
  poLong?: number;  // Post Office longitude
  place?: string;  // Locality/village name. Nullable
  placeLat?: number;  // Place latitude
  placeLong?: number;  // Place longitude
  isActive?: boolean;  // Default TRUE. Soft-enable/disable without deleting
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  updatedAt: Date;  // Auto by DB
  createdAt: Date;  // Auto by DB — DEFAULT CURRENT_TIMESTAMP
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
