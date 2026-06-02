import { Documents } from '../entities/documents.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toDocumentsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toDocumentsList(rows: any[]) {
  return rows.map(toDocumentsResponse);
}