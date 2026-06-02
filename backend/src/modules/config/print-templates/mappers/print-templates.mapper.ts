import { PrintTemplates } from '../entities/print-templates.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toPrintTemplatesResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toPrintTemplatesList(rows: any[]) {
  return rows.map(toPrintTemplatesResponse);
}