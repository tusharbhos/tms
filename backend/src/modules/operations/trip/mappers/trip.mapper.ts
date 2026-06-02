import { Trip } from '../entities/trip.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toTripResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    manifestId: row.manifestId?.toString(),
    drsId: row.drsId?.toString(),
  };
}

export function toTripList(rows: any[]) {
  return rows.map(toTripResponse);
}