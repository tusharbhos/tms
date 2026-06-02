import { Booking } from '../entities/booking.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toBookingResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
  };
}

export function toBookingList(rows: any[]) {
  return rows.map(toBookingResponse);
}