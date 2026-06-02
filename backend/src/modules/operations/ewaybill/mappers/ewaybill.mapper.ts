import { Ewaybill } from '../entities/ewaybill.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toEwaybillResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    lrId: row.lrId?.toString(),
    bookingId: row.bookingId?.toString(),
  };
}

export function toEwaybillList(rows: any[]) {
  return rows.map(toEwaybillResponse);
}