import { CreateChannelPartnerSchema } from '../dto/create-channel-partner.dto';
import { UpdateChannelPartnerSchema } from '../dto/update-channel-partner.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreateChannelPartnerSchema,
  update: UpdateChannelPartnerSchema,
};
