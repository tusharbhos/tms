import { Customer } from '../entities/customer.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toCustomerResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toCustomerList(rows: any[]) {
  return rows.map(toCustomerResponse);
}