import { z } from 'zod';
import { CreatePackageScanLogsSchema } from './create-package-scan-logs.dto';

// UPDATE DTO — all fields optional (partial).
export const UpdatePackageScanLogsSchema = CreatePackageScanLogsSchema.partial();
export type UpdatePackageScanLogsDto = z.infer<typeof UpdatePackageScanLogsSchema>;
