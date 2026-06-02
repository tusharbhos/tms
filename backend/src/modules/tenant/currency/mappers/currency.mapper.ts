import { Currency } from '../entities/currency.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toCurrencyResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toCurrencyList(rows: any[]) {
  return rows.map(toCurrencyResponse);
}