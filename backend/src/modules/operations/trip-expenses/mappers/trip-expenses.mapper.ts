import { TripExpenses } from '../entities/trip-expenses.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toTripExpensesResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    tripId: row.tripId?.toString(),
  };
}

export function toTripExpensesList(rows: any[]) {
  return rows.map(toTripExpensesResponse);
}