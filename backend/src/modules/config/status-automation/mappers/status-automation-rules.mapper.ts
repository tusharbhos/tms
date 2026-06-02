import { StatusAutomationRules } from '../entities/status-automation-rules.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toStatusAutomationRulesResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toStatusAutomationRulesList(rows: any[]) {
  return rows.map(toStatusAutomationRulesResponse);
}