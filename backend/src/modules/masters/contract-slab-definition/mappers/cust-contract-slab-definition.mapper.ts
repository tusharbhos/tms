import { CustContractSlabDefinition } from '../entities/cust-contract-slab-definition.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toCustContractSlabDefinitionResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    custContractId: row.custContractId?.toString(),
    supersededBy: row.supersededBy?.toString(),
    previousVersionId: row.previousVersionId?.toString(),
  };
}

export function toCustContractSlabDefinitionList(rows: any[]) {
  return rows.map(toCustContractSlabDefinitionResponse);
}