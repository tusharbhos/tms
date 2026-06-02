import { IncidentDocuments } from '../entities/incident-documents.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toIncidentDocumentsResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
    id: row.id?.toString(),
    incidentId: row.incidentId?.toString(),
  };
}

export function toIncidentDocumentsList(rows: any[]) {
  return rows.map(toIncidentDocumentsResponse);
}