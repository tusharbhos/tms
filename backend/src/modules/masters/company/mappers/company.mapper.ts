import { Company } from '../entities/company.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toCompanyResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toCompanyList(rows: any[]) {
  return rows.map(toCompanyResponse);
}