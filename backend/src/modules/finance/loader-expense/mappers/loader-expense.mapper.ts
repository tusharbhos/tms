import { LoaderExpense } from '../entities/loader-expense.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toLoaderExpenseResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    manifestId: row.manifestId?.toString(),
    tripId: row.tripId?.toString(),
  };
}

export function toLoaderExpenseList(rows: any[]) {
  return rows.map(toLoaderExpenseResponse);
}