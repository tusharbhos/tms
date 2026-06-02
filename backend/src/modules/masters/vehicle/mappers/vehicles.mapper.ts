import { Vehicles } from '../entities/vehicles.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toVehiclesResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toVehiclesList(rows: any[]) {
  return rows.map(toVehiclesResponse);
}