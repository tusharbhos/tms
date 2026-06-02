import { z } from 'zod';

// CREATE DTO for txn_manifest_lrs — validated business fields only.
export const CreateManifestLrsSchema = z.object({
  manifestId: z.number(),
  lrId: z.number(),
  numPackages: z.number().optional().nullable(),
  weightKg: z.number().optional().nullable(),
  isLoaded: z.boolean().optional().nullable(),
  loadedBy: z.number().optional().nullable(),
  loadedAt: z.coerce.date().optional().nullable(),
  isReceived: z.boolean().optional().nullable(),
  receivedBy: z.number().optional().nullable(),
  receivedAt: z.coerce.date().optional().nullable(),
  shortagePkg: z.number().optional().nullable(),
  excessPkg: z.number().optional().nullable(),
  damageFlag: z.boolean().optional().nullable(),
  loadedScanTime: z.coerce.date().optional().nullable(),
  receivedScanTime: z.coerce.date().optional().nullable(),
  exceptionStatus: z.string().optional().nullable(),
  exceptionRemarks: z.string().optional().nullable(),
});

export type CreateManifestLrsDto = z.infer<typeof CreateManifestLrsSchema>;