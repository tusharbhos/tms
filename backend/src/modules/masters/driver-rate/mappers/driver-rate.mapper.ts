import { DriverRate } from '../entities/driver-rate.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toDriverRateResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    supersededBy: row.supersededBy?.toString(),
    previousVersionId: row.previousVersionId?.toString(),
  };
}

export function toDriverRateList(rows: any[]) {
  return rows.map(toDriverRateResponse);
}