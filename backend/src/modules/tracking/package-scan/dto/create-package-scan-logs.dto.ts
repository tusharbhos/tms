import { z } from 'zod';

// CREATE DTO for txn_package_scan_logs — validated business fields only.
export const CreatePackageScanLogsSchema = z.object({
  barcodeNo: z.string().optional().nullable(),
  lrId: z.number(),
  bookingId: z.number(),
  bookingItemId: z.number(),
  scanStage: z.string().optional().nullable(),
  scanResult: z.string().optional().nullable(),
  officeId: z.number(),
  tripId: z.number(),
  scannedBy: z.number().optional().nullable(),
  scanDeviceId: z.string(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  scannedAt: z.coerce.date().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
});

export type CreatePackageScanLogsDto = z.infer<typeof CreatePackageScanLogsSchema>;