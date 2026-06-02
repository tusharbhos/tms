import { Addresses } from '../entities/addresses.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toAddressesResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toAddressesList(rows: any[]) {
  return rows.map(toAddressesResponse);
}