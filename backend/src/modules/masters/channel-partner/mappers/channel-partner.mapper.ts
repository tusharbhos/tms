import { ChannelPartner } from '../entities/channel-partner.entity';

// Mapper — DB row -> API response (BigInt -> string for JSON safety).
export function toChannelPartnerResponse(row: any) {
  if (!row) return row;
  return {
    ...row,
  };
}

export function toChannelPartnerList(rows: any[]) {
  return rows.map(toChannelPartnerResponse);
}