import { DocumentVerifications } from '../entities/document-verifications.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toDocumentVerificationsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
  };
}

export function toDocumentVerificationsList(rows: any[]) {
  return rows.map(toDocumentVerificationsResponse);
}