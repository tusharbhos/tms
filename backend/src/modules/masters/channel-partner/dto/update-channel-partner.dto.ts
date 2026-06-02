import { z } from 'zod';
import { CreateChannelPartnerSchema } from './create-channel-partner.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateChannelPartnerSchema = CreateChannelPartnerSchema.partial();
export type UpdateChannelPartnerDto = z.infer<typeof UpdateChannelPartnerSchema>;
