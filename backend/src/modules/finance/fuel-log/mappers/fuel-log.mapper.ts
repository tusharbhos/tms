import { FuelLog } from '../entities/fuel-log.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toFuelLogResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    tripId: row.tripId?.toString(),
  };
}

export function toFuelLogList(rows: any[]) {
  return rows.map(toFuelLogResponse);
}