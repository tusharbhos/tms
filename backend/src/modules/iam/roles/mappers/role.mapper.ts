import { Role } from '../entities/role.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toRoleResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toRoleList(rows: any[]) {
  return rows.map(toRoleResponse);
}