import { CustContractSlabRates } from '../entities/cust-contract-slab-rates.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toCustContractSlabRatesResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    custContractId: row.custContractId?.toString(),
    fromPlaceId: row.fromPlaceId?.toString(),
    toPlaceId: row.toPlaceId?.toString(),
    supersededBy: row.supersededBy?.toString(),
    previousVersionId: row.previousVersionId?.toString(),
  };
}

export function toCustContractSlabRatesList(rows: any[]) {
  return rows.map(toCustContractSlabRatesResponse);
}