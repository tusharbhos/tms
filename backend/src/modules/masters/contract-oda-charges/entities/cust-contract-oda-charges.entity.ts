// Auto-generated entity for `cust_contract_oda_charges` (16 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface CustContractOdaCharges {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → tenant
  custContractId?: number;  // FK → cust_contract
  ctrNum?: string;  // Contract number (denormalised)
  fromPlaceId?: number;  // FK → station_coverage (origin)
  fromPlace?: string;  // Origin place name. Mandatory
  toPlaceId?: number;  // FK → station_coverage (destination)
  toPlace?: string;  // Destination place name. Mandatory
  rate?: number;  // ODA surcharge rate. Mandatory
  isActive?: boolean;  // Default TRUE. Soft-enable/disable without deleting
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
