import { Drs } from '../entities/drs.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toDrsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    tripId: row.tripId?.toString(),
  };
}

export function toDrsList(rows: any[]) {
  return rows.map(toDrsResponse);
}