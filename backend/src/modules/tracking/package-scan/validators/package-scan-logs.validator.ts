import { CreatePackageScanLogsSchema } from '../dto/create-package-scan-logs.dto';
import { UpdatePackageScanLogsSchema } from '../dto/update-package-scan-logs.dto';

// Thin re-export so callers can import validators from one place.
// Add cross-field / business-rule refinements here as the domain grows.
export const validators = {
  create: CreatePackageScanLogsSchema,
  update: UpdatePackageScanLogsSchema,
};
