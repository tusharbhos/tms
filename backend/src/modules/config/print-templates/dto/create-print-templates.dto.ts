import { z } from 'zod';

// CREATE DTO for print_templates — validated business fields only.
export const CreatePrintTemplatesSchema = z.object({
  companyId: z.number(),
  templateType: z.number().optional().nullable(),
  templateName: z.string().optional().nullable(),
  templateCode: z.string().optional().nullable(),
  paperSize: z.string().optional().nullable(),
  orientation: z.string().optional().nullable(),
  copies: z.number().optional().nullable(),
  templateHtml: z.string().optional().nullable(),
  variablesSchema: z.record(z.any()).optional().nullable(),
  includeLogo: z.boolean().optional().nullable(),
  includeStamp: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  versionNo: z.number().optional().nullable(),
});

export type CreatePrintTemplatesDto = z.infer<typeof CreatePrintTemplatesSchema>;