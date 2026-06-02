import { DocumentTypes } from '../entities/document-types.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toDocumentTypesResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toDocumentTypesList(rows: any[]) {
  return rows.map(toDocumentTypesResponse);
}