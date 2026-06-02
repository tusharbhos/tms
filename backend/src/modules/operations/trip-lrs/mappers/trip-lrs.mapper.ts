import { TripLrs } from '../entities/trip-lrs.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toTripLrsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    tripId: row.tripId?.toString(),
    lrId: row.lrId?.toString(),
  };
}

export function toTripLrsList(rows: any[]) {
  return rows.map(toTripLrsResponse);
}