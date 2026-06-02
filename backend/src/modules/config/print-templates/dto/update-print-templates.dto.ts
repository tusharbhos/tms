import { z } from 'zod';
import { CreatePrintTemplatesSchema } from './create-print-templates.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdatePrintTemplatesSchema = CreatePrintTemplatesSchema.partial();
export type UpdatePrintTemplatesDto = z.infer<typeof UpdatePrintTemplatesSchema>;
