import { VehicleLocationLogs } from '../entities/vehicle-location-logs.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toVehicleLocationLogsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    tripId: row.tripId?.toString(),
  };
}

export function toVehicleLocationLogsList(rows: any[]) {
  return rows.map(toVehicleLocationLogsResponse);
}