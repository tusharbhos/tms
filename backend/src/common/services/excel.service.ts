import { Injectable, BadRequestException, StreamableFile } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

/**
 * Reusable Excel service — used by EVERY module for:
 *   - GET  /<resource>/template   → blank Excel template with headers + sample row
 *   - GET  /<resource>/export     → Excel of current data (filtered)
 *   - POST /<resource>/import     → bulk-create from uploaded Excel
 *
 * Frontends only need to wire a button — backend does the heavy lifting.
 */
export interface ColumnDef {
  /** db field name, e.g. "customerCode" */
  key: string;
  /** human label for the Excel header, e.g. "Customer Code" */
  label: string;
  /** zod-like type hint for casting on import */
  type?: 'string' | 'number' | 'boolean' | 'date';
  /** is this required on import? */
  required?: boolean;
  /** sample value to populate in template */
  sample?: any;
  /** width in Excel chars */
  width?: number;
}

@Injectable()
export class ExcelService {
  /** Build a blank Excel template — headers + one sample row + a notes sheet. */
  async buildTemplate(sheetName: string, columns: ColumnDef[]): Promise<Buffer> {
    const wb = new ExcelJS.Workbook();
    wb.creator = 'TMS Platform';
    wb.created = new Date();

    // ─── sheet 1: data with headers + sample row ───
    const ws = wb.addWorksheet(sheetName);
    ws.columns = columns.map((c) => ({
      header: c.label + (c.required ? ' *' : ''),
      key: c.key,
      width: c.width ?? 18,
    }));
    // style header row
    ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
    ws.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getRow(1).height = 22;

    // sample row
    const sampleRow: any = {};
    columns.forEach((c) => { sampleRow[c.key] = c.sample ?? ''; });
    ws.addRow(sampleRow);
    ws.getRow(2).font = { italic: true, color: { argb: 'FF6B7280' } };

    // freeze header
    ws.views = [{ state: 'frozen', ySplit: 1 }];

    // ─── sheet 2: notes ───
    const notes = wb.addWorksheet('Notes');
    notes.columns = [{ header: 'Field', key: 'k', width: 24 }, { header: 'Description', key: 'd', width: 60 }];
    notes.getRow(1).font = { bold: true };
    notes.addRow({ k: '* (asterisk)', d: 'Required field. Import will fail if left blank.' });
    notes.addRow({ k: 'Sample row',   d: 'Row 2 in the first sheet shows an example. DELETE IT before importing.' });
    notes.addRow({ k: 'Date format',  d: 'Use ISO YYYY-MM-DD or Excel native date.' });
    notes.addRow({ k: 'Boolean',      d: 'Use TRUE / FALSE (case-insensitive).' });
    columns.forEach((c) => {
      notes.addRow({ k: c.label, d: `${c.type ?? 'string'}${c.required ? ' · REQUIRED' : ''}` });
    });

    return (await wb.xlsx.writeBuffer()) as unknown as Buffer;
  }

  /** Export current rows to Excel. */
  async buildExport(sheetName: string, columns: ColumnDef[], rows: any[]): Promise<Buffer> {
    const wb = new ExcelJS.Workbook();
    wb.creator = 'TMS Platform';
    wb.created = new Date();

    const ws = wb.addWorksheet(sheetName);
    ws.columns = columns.map((c) => ({ header: c.label, key: c.key, width: c.width ?? 18 }));
    ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };

    rows.forEach((r) => {
      const flat: any = {};
      columns.forEach((c) => {
        let v = r[c.key];
        if (v && typeof v === 'object' && v.toISOString) v = v.toISOString().slice(0, 10);
        if (typeof v === 'bigint') v = v.toString();
        flat[c.key] = v ?? '';
      });
      ws.addRow(flat);
    });

    ws.views = [{ state: 'frozen', ySplit: 1 }];
    return (await wb.xlsx.writeBuffer()) as unknown as Buffer;
  }

  /** Parse an uploaded .xlsx into typed records. Returns { ok, rows, errors }. */
  async parseImport(
    buffer: Buffer,
    columns: ColumnDef[],
  ): Promise<{ ok: boolean; rows: any[]; errors: { row: number; field: string; message: string }[] }> {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buffer as any);
    const ws = wb.worksheets[0];
    if (!ws) throw new BadRequestException('No sheet found in file');

    const headers: string[] = [];
    ws.getRow(1).eachCell((cell, col) => {
      headers[col] = String(cell.value ?? '').replace(/\s*\*$/, '').trim();
    });

    // map header label → column def
    const byLabel = new Map(columns.map((c) => [c.label, c]));
    const out: any[] = [];
    const errors: { row: number; field: string; message: string }[] = [];

    for (let r = 2; r <= ws.rowCount; r++) {
      const excelRow = ws.getRow(r);
      if (excelRow.actualCellCount === 0) continue;

      const obj: any = {};
      let isEmpty = true;

      headers.forEach((label, col) => {
        if (!label) return;
        const def = byLabel.get(label);
        if (!def) return;
        const raw = excelRow.getCell(col).value;
        if (raw === null || raw === undefined || raw === '') {
          if (def.required) errors.push({ row: r, field: def.key, message: `${def.label} is required` });
          return;
        }
        isEmpty = false;
        try { obj[def.key] = this.castValue(raw, def.type ?? 'string'); }
        catch (e: any) { errors.push({ row: r, field: def.key, message: `${def.label}: ${e.message}` }); }
      });

      if (!isEmpty) out.push(obj);
    }

    return { ok: errors.length === 0, rows: out, errors };
  }

  private castValue(raw: any, type: 'string' | 'number' | 'boolean' | 'date'): any {
    if (raw && typeof raw === 'object' && 'text' in raw) raw = raw.text;
    if (raw && typeof raw === 'object' && 'result' in raw) raw = raw.result;
    switch (type) {
      case 'number': {
        const n = Number(raw);
        if (Number.isNaN(n)) throw new Error(`'${raw}' is not a number`);
        return n;
      }
      case 'boolean': {
        const s = String(raw).trim().toLowerCase();
        if (['true', '1', 'yes', 'y'].includes(s)) return true;
        if (['false', '0', 'no', 'n', ''].includes(s)) return false;
        throw new Error(`'${raw}' is not a boolean`);
      }
      case 'date': {
        if (raw instanceof Date) return raw;
        const d = new Date(raw);
        if (Number.isNaN(d.getTime())) throw new Error(`'${raw}' is not a date`);
        return d;
      }
      default:
        return String(raw).trim();
    }
  }
}
