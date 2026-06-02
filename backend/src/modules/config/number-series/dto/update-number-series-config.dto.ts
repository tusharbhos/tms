import { z } from 'zod';
import { CreateNumberSeriesConfigSchema } from './create-number-series-config.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdateNumberSeriesConfigSchema = CreateNumberSeriesConfigSchema.partial();
export type UpdateNumberSeriesConfigDto = z.infer<typeof UpdateNumberSeriesConfigSchema>;
