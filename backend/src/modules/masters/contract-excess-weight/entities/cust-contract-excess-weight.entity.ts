// Auto-generated entity for `cust_contract_excess_weight` (14 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface CustContractExcessWeight {
  id: number;  // PK, autoincrement
  tenantId?: number;  // FK → tenant
  custContractId?: number;  // FK → cust_contract
  ctrNum?: string;  // Contract number (denormalised)
  lowerLimit?: number;  // Weight range lower bound. Mandatory
  upperLimit?: number;  // Weight range upper bound. Mandatory
  rate?: number;  // Extra charge amount for this weight range. Mandatory
  isActive?: boolean;  // Default TRUE. Soft-enable/disable without deleting
  createdBy?: number;  // FK → users
  updatedBy?: number;  // FK → users
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
  deletedAt?: Date;  // Soft delete timestamp. NULL = active
  deletedBy?: number;  // FK → masterdata_users.id — Who soft-deleted
}
