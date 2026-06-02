import { PrnBookings } from '../entities/prn-bookings.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toPrnBookingsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    prnId: row.prnId?.toString(),
    bookingId: row.bookingId?.toString(),
    lrId: row.lrId?.toString(),
  };
}

export function toPrnBookingsList(rows: any[]) {
  return rows.map(toPrnBookingsResponse);
}