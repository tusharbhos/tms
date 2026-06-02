import { BookingCharges } from '../entities/booking-charges.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toBookingChargesResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    bookingId: row.bookingId?.toString(),
    lrId: row.lrId?.toString(),
  };
}

export function toBookingChargesList(rows: any[]) {
  return rows.map(toBookingChargesResponse);
}