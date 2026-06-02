import { BankAccounts } from '../entities/bank-accounts.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toBankAccountsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toBankAccountsList(rows: any[]) {
  return rows.map(toBankAccountsResponse);
}