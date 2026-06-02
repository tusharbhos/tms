import { TaxRegistrations } from '../entities/tax-registrations.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toTaxRegistrationsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toTaxRegistrationsList(rows: any[]) {
  return rows.map(toTaxRegistrationsResponse);
}