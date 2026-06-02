import { Organizations } from '../entities/organizations.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toOrganizationsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toOrganizationsList(rows: any[]) {
  return rows.map(toOrganizationsResponse);
}