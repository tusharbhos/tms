import { CustContractOdaCharges } from '../entities/cust-contract-oda-charges.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toCustContractOdaChargesResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    custContractId: row.custContractId?.toString(),
    fromPlaceId: row.fromPlaceId?.toString(),
    toPlaceId: row.toPlaceId?.toString(),
  };
}

export function toCustContractOdaChargesList(rows: any[]) {
  return rows.map(toCustContractOdaChargesResponse);
}