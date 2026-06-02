import { Office } from '../entities/office.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toOfficeResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toOfficeList(rows: any[]) {
  return rows.map(toOfficeResponse);
}