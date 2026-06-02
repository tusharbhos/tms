import { z } from 'zod';

// CREATE DTO for status_master — validated business fields only.
export const CreateStatusMasterSchema = z.object({
  moduleName: z.string().optional().nullable(),
  statusCode: z.string().optional().nullable(),
  statusName: z.string().optional().nullable(),
  colorCode: z.string().optional().nullable(),
  textColor: z.string().optional().nullable(),
  sequenceNo: z.number().optional().nullable(),
  isFinalStatus: z.boolean().optional().nullable(),
  isDefault: z.boolean().optional().nullable(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
});

export type CreateStatusMasterDto = z.infer<typeof CreateStatusMasterSchema>;