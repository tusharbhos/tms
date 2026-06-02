import { Privileges } from '../entities/privileges.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toPrivilegesResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toPrivilegesList(rows: any[]) {
  return rows.map(toPrivilegesResponse);
}