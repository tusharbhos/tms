import { BookingItems } from '../entities/booking-items.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toBookingItemsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    bookingId: row.bookingId?.toString(),
    lrId: row.lrId?.toString(),
  };
}

export function toBookingItemsList(rows: any[]) {
  return rows.map(toBookingItemsResponse);
}