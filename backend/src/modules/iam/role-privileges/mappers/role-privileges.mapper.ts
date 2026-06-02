import { RolePrivileges } from '../entities/role-privileges.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toRolePrivilegesResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toRolePrivilegesList(rows: any[]) {
  return rows.map(toRolePrivilegesResponse);
}