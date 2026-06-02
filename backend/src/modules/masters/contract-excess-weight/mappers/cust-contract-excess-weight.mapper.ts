import { CustContractExcessWeight } from '../entities/cust-contract-excess-weight.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toCustContractExcessWeightResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    custContractId: row.custContractId?.toString(),
  };
}

export function toCustContractExcessWeightList(rows: any[]) {
  return rows.map(toCustContractExcessWeightResponse);
}