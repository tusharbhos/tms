import { Dashboards } from '../entities/dashboards.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toDashboardsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toDashboardsList(rows: any[]) {
  return rows.map(toDashboardsResponse);
}