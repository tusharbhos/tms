import { LoaderRate } from '../entities/loader-rate.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toLoaderRateResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    supersededBy: row.supersededBy?.toString(),
    previousVersionId: row.previousVersionId?.toString(),
  };
}

export function toLoaderRateList(rows: any[]) {
  return rows.map(toLoaderRateResponse);
}