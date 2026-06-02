import { Prn } from '../entities/prns.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toPrnResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
  };
}

export function toPrnList(rows: any[]) {
  return rows.map(toPrnResponse);
}
