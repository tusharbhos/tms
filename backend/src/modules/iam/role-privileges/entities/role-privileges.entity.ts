// Auto-generated entity for `role_privileges` (4 columns)
// Source: TMS schema (Excel). Maps 1:1 to the DB table.

export interface RolePrivileges {
  roleId?: number;  // PK (composite) + FK → role. Mandatory
  privilegeId?: number;  // PK (composite) + FK → privileges. Mandatory
  createdAt: Date;  // Auto by DB
  updatedAt: Date;  // Auto by DB
}
