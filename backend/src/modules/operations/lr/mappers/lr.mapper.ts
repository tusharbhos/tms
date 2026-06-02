import { Lr } from '../entities/lr.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toLrResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    bookingId: row.bookingId?.toString(),
    podId: row.podId?.toString(),
    originalLrId: row.originalLrId?.toString(),
  };
}

export function toLrList(rows: any[]) {
  return rows.map(toLrResponse);
}