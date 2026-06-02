import { Driver } from '../entities/driver.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toDriverResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toDriverList(rows: any[]) {
  return rows.map(toDriverResponse);
}