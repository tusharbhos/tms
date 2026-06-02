import { ContactPersons } from '../entities/contact-persons.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toContactPersonsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toContactPersonsList(rows: any[]) {
  return rows.map(toContactPersonsResponse);
}