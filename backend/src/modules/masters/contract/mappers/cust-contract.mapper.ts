import { CustContract } from '../entities/cust-contract.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toCustContractResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    supersededBy: row.supersededBy?.toString(),
    previousVersionId: row.previousVersionId?.toString(),
  };
}

export function toCustContractList(rows: any[]) {
  return rows.map(toCustContractResponse);
}